import os
import time
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import time
import requests  # 导入 requests 库来发起 HTTP 请求
from flask_socketio import SocketIO
import threading
from flask_cors import CORS  # 导入 CORS 扩展
import pandas as pd  # 导入 pandas

from openpyxl import Workbook, load_workbook


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
                    # 读取 Excel 文件
                    df = pd.read_excel('data.xlsx')
                    
                    data_array = df.to_json()

                    # 发送到前端
                    socketio.emit('file_modified', {'data': data_array, 'status': 'success'})
                    
                    # 调用 Express 接口上传数据
                    response = requests.post(
                        'http://localhost:3000/upload',  # Express 服务的接口地址
                        json={'filePath': 'data.xlsx'}
                    )

                    if response.status_code == 200:
                        print("数据上传成功:", response.json())
                        socketio.emit('upload_result', {'status': 'success'})
                    else:
                        print("上传失败:", response.json())
                        socketio.emit('upload_result', {'status': 'error', 'message': response.json().get('error')})

                except Exception as e:
                    print(f"读取或处理 Excel 文件时出错: {e}")
                    socketio.emit('file_modified', {'error': str(e)})
                # 更新最后修改时间
                last_modified_time = current_modified_time
            time.sleep(interval)
        except KeyboardInterrupt:
            print("监控已停止。")
            break

# 启动文件监控的线程
def start_file_watching():
    file_path = "data.xlsx"
    thread = threading.Thread(target=watch_file, args=(file_path,))
    thread.daemon = True
    thread.start()
@app.route('/runData', methods=['POST'])
def run_data():
    # 接收前端发送的数据（JSON格式）
    data = request.get_json()
    print(data, 'data...')  # 打印接收到的数据
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # 文件名
    file_name = "step.xlsx"

    # 创建一个新的工作簿和工作表
    workbook = Workbook()
    sheet = workbook.active
    # 添加标题行
    sheet.append(["Timestamp", "Step", "Formatted Date"])

    # 将数据写入 Excel（假设 data 是一个列表）
    for entry in data:
        sheet.append([entry['timestamp'], entry['step'], entry['formattedDate']])

    # 保存文件
    workbook.save(file_name)
    df = pd.read_excel("step.xlsx")
    print(df, 'dfffffffff')
    data_array = df.to_json()
    # 通过 WebSocket 发送数据
    socketio.emit('step_connect', {'data': data_array})
    return jsonify({"message": "Data written successfully to step.xlsx"}), 200
# 首页，返回HTML页面
@app.route('/')
def index():
    return 'helelo'

# WebSocket消息处理
@socketio.on('connect')
def handle_connect():
    print("客户端已连接！")
    try:
        # 读取 Excel 文件
        df = pd.read_excel("data.xlsx")
        data_array = df.to_json()
        # 通过 WebSocket 发送数据
        socketio.emit('file_modified', {'data': data_array })
    except Exception as e:
        print(f"读取 Excel 文件时出错: {e}")
        socketio.emit('file_modified', {'error': '读取 Excel 文件时出错'})

# 订阅自定义事件
@socketio.on('custom_event')
def handle_custom_event():
    df = pd.read_excel('data.xlsx')
    data_array = format_data(df)
    socketio.emit('custom_event_response', {'status': 'received', 'data': data_array})

def format_data(df):
    # Convert the 'Time' column to the desired format
    if 'Time' in df.columns:
        df['Time'] = pd.to_datetime(df['Time']).apply(lambda x: (x - datetime(1899, 12, 30)).days + (x - datetime(x.year, x.month, x.day)).total_seconds() / 86400.0)
    
    # Convert DataFrame to a list of lists
    data_list = [df.columns.tolist()] + df.values.tolist()
    return {'data': data_list}
@socketio.on('stepresponse')
def stepc():
    df = pd.read_excel("step.xlsx")
    print(df, 'dfffffffff')
    data_array = df.to_json()
    # 通过 WebSocket 发送数据
    socketio.emit('step_connect', {'data': data_array})
# 运行Flask应用并启动WebSocket
if __name__ == '__main__':
    start_file_watching()  # 启动文件监控线程
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, use_reloader=False)  # 禁用调试模式和自动重载
