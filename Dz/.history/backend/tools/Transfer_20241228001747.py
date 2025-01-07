
import json
import pandas as pd
import sys

def transfer(file_path):
    """
    将指定的 .xlsx 文件转换为 JSON 格式并返回。
    """
    try:
        # 读取 Excel 文件
        df = pd.read_excel(file_path, sheet_name=None)
        json_data = {}

        # 遍历所有工作表
        for sheet_name, sheet_data in df.items():
            # 将数据转换为 Python 原生类型
            json_data[sheet_name] = sheet_data.astype(object).where(pd.notnull(sheet_data), None).to_dict(orient='records')
        
        # 返回 JSON 数据
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
