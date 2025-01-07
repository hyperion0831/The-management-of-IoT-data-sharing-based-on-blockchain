import json
import pandas as pd
import sys
from datetime import datetime

def convert_datetime(obj):
    """检查并转换 datetime 类型为字符串"""
    if isinstance(obj, datetime):
        return obj.strftime("%Y-%m-%d %H:%M:%S")
    return obj

def transfer(file_path):
    try:
        df = pd.read_excel(file_path)  # 默认只读第一个工作表
        # 确保将 datetime 转换为字符串
        json_data = df.astype(object).where(pd.notnull(df), None).to_dict(orient='records')
        json_data = [
            {key: convert_datetime(value) for key, value in record.items()}
            for record in json_data
        ]
        return json_data
    except Exception as e:
        print(f"转换失败：{file_path}，错误信息：{e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # 获取传入的文件路径
    input_file = sys.argv[1]
    # 调用转换函数
    data = transfer(input_file)
    # 输出 JSON 数据
    print(json.dumps(data, ensure_ascii=False, indent=4))
