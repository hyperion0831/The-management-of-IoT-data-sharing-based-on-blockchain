from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/runData', methods=['POST'])
def run_data():
    # 接收前端发送的数据（JSON格式）
    data = request.get_json()
    print('接收到的数据:', data)
    # 在这里处理数据
    # 返回响应
    return jsonify({'status': 'success', 'message': '数据接收成功'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 