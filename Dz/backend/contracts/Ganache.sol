// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ganache {
    // 定义结构体存储每条数据
    struct Data {
        uint256 id;         // 唯一标识符
        string content;     // 数据内容
    }

    // 数据存储映射
    mapping(uint256 => Data) public dataStore;

    // 事件，通知数据上传
    event DataUploaded(uint256 indexed id, string content);

    // 上传数据的方法
    function uploadData(uint256[] memory ids, string[] memory contents) public {
        // 确保 IDs 和 Contents 的长度相同
        require(ids.length == contents.length, "IDs and contents length mismatch");

        // 循环处理每条数据
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            string memory content = contents[i];

            // 保存到映射中
            dataStore[id] = Data({id: id, content: content});

            // 触发事件
            emit DataUploaded(id, content);
        }
    }

    // 获取数据的方法（可选，直接通过映射也能获取）
    function getData(uint256 id) public view returns (uint256, string memory) {
        Data memory data = dataStore[id];
        return (data.id, data.content);
    }
}
