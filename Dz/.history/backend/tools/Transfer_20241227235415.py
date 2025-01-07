import os
import json
import pandas as pd

def convert_xlsx_to_json(folder_path, output_folder):
    """
    将文件夹中的所有 .xlsx 文件转换为 .json 文件。

    :param folder_path: 包含 .xlsx 文件的文件夹路径
    :param output_folder: 输出 .json 文件的文件夹路径
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # 遍历文件夹中的所有 .xlsx 文件
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.xlsx'):
            file_path = os.path.join(folder_path, file_name)
            try:
                # 读取 Excel 文件
                df = pd.read_excel(file_path, sheet_name=None)
                json_data = {}

                # 遍历所有工作表
                for sheet_name, sheet_data in df.items():
                    # 将数据转换为 Python 原生类型
                    json_data[sheet_name] = sheet_data.astype(object).where(pd.notnull(sheet_data), None).to_dict(orient='records')
                
                # 输出为 JSON 文件
                output_file = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.json")
                with open(output_file, 'w', encoding='utf-8') as json_file:
                    json.dump(json_data, json_file, ensure_ascii=False, indent=4)
                
                print(f"成功转换：{file_name} -> {output_file}")
            except Exception as e:
                print(f"转换失败：{file_name}，错误信息：{e}")

if __name__ == "__main__":
    # 输入文件夹路径（包含 .xlsx 文件）
    input_folder = "path_to_your_xlsx_folder"  # 替换为实际的文件夹路径
    # 输出文件夹路径
    output_folder = "path_to_your_output_folder"  # 替换为实际的输出文件夹路径
    
    convert_xlsx_to_json(input_folder, output_folder)
