import os
import time
from flask import Flask, render_template
from flask_socketio import SocketIO
import threading
from flask_cors import CORS  # 导入 CORS 扩展
import pandas as pd  # 导入 pandas
import subprocess  # 用于调用 Node.js 脚本



# 初始化Flask和SocketIO
app = Flask(__name__)
CORS(app)# 启用跨域支持
socketio = SocketIO(app, cors_allowed_origins="*")  # 允许跨域请求

# 文件监控函数
def watch_file(file_path, interval=1):
    if not os.path.exists(file_path):
        print(f"文件 {file_path} 不存在。")
        return
    
    # 获取初始修改时间
    last_modified_time = os.path.getmtime(file_path)
    print(f"开始监控文件 {file_path} 的变化...")

    while True:
        try:
            # 检查当前的修改时间
            current_modified_time = os.path.getmtime(file_path)
            if current_modified_time != last_modified_time:
                print("文件修改了")
                # 文件发生变化，通过WebSocket发送消息
                try:
                    try:
                        df = pd.read_excel(file_path)
                        if df.empty:
                            raise ValueError(f"Excel 文件为空: {file_path}")
                        print("文件读取成功")
                    except Exception as e:
                        print(f"读取或处理 Excel 文件时出错: {e}")

                    data_array = df.to_json()

                    # 发送到前端
                    socketio.emit('file_modified', {'data': data_array, 'status': 'success'})
                    
                    # 调用 SendData.js 上传数据到区块链
                    result = subprocess.run(
                        ['node', '../services/SendData.js', '../dataset/data.xlsx'],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                    if result.returncode == 0:
                        # 提取交易哈希（交易地址）并发送到前端
                        transaction_hash = result.stdout.strip()  # 假设 SendData.js 返回交易哈希
                        print("数据上传成功，交易哈希:", transaction_hash)
                        socketio.emit('upload_result', {
                            'status': 'success',
                            'transactionHash': transaction_hash
                        })
                    else:
                        print("数据上传失败:", result.stderr)
                        socketio.emit('upload_result', {'status': 'error', 'message': result.stderr})
                except Exception as e:
                    print(f"读取或处理 Excel 文件时出错: {e}")
                    socketio.emit('file_modified', {'error': str(e)})

                except Exception as e:
                    print(f"上传数据到区块链时出错: {e}")
                    socketio.emit('file_modified', {'status': 'error', 'message': str(e)})
                # 更新最后修改时间
                last_modified_time = current_modified_time
            time.sleep(interval)
        except KeyboardInterrupt:
            print("监控已停止。")
            break

# 启动文件监控的线程
def start_file_watching():
    file_path = "../dataset/data.xlsx"  # 这里填上你要监控的文件路径
    thread = threading.Thread(target=watch_file, args=(file_path,))
    thread.daemon = True
    thread.start()

# 首页，返回HTML页面
@app.route('/')
def index():
    return render_template('index.html')

# WebSocket消息处理
@socketio.on('connect')
def handle_connect():
    print("客户端已连接！")
    try:
        # 读取 Excel 文件
        df = pd.read_excel("../dataset/data.xlsx")
        data_array = df.to_json()
        # 通过 WebSocket 发送数据
        socketio.emit('file_modified', {'data': data_array})
    except Exception as e:
        print(f"读取 Excel 文件时出错: {e}")
        socketio.emit('file_modified', {'error': '读取 Excel 文件时出错'})

# 运行Flask应用并启动WebSocket
if __name__ == '__main__':
    start_file_watching()  # 启动文件监控线程
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, use_reloader=False)  # 禁用调试模式和自动重载
