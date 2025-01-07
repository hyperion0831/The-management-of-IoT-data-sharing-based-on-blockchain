// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExcelDataContract {
    // 数据存储结构
    struct RowData {
        uint256 id;        // 行号或唯一标识
        string content;    // 每行的内容（可以是 JSON 格式的字符串）
    }

    mapping(uint256 => RowData) public dataRows; // 用于存储每行数据
    uint256 public rowCount; // 数据总行数

    // 事件，用于记录上传数据
    event DataUploaded(uint256 indexed rowId, string content);

    // 存储解析后的 .xlsx 数据
    function uploadData(uint256[] memory ids, string[] memory contents) public {
        require(ids.length == contents.length, "ids and contents must have the same length");

        for (uint256 i = 0; i < ids.length; i++) {
            dataRows[ids[i]] = RowData(ids[i], contents[i]);
            emit DataUploaded(ids[i], contents[i]);
        }

        rowCount += ids.length;
    }

    // 获取指定行的数据
    function getData(uint256 id) public view returns (RowData memory) {
        return dataRows[id];
    }

    // 获取数据总行数
    function getRowCount() public view returns (uint256) {
        return rowCount;
    }
}
