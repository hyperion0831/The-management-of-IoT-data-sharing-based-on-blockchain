// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthDataContract {
    // 存储两份 JSON 数据
    string public jsonData1;
    string public jsonData2;

    // 存储第一份 JSON 数据
    function storeJsonData1(string memory _data) public {
        jsonData1 = _data;
    }

    // 存储第二份 JSON 数据
    function storeJsonData2(string memory _data) public {
        jsonData2 = _data;
    }

    // 获取第一份 JSON 数据
    function retrieveJsonData1() public view returns (string memory) {
        return jsonData1;
    }

    // 获取第二份 JSON 数据
    function retrieveJsonData2() public view returns (string memory) {
        return jsonData2;
    }
}
