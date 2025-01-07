
import json
import pandas as pd
import sys

def transfer(file_path):
    try:
        df = pd.read_excel(file_path)  # 默认只读第一个工作表
        json_data = df.astype(object).where(pd.notnull(df), None).to_dict(orient='records')
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
