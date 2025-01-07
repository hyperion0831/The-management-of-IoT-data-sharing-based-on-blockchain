// contracts/DataContract.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DataContract {
    string public data;

    // 存储数据
    function storeData(string memory _data) public {
        data = _data;
    }

    // 获取数据
    function retrieveData() public view returns (string memory) {
        return data;
    }
}
