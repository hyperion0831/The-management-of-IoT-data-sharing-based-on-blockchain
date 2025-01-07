// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthDataContract {
    // 定义事件，用于记录上传的数据
    event DataUploaded(address indexed user, uint heartRate, uint timestamp);

    // 定义结构体，存储健康数据
    struct HealthData {
        uint heartRate;
        uint timestamp;
    }

    // 用户地址到健康数据的映射
    mapping(address => HealthData[]) private userHealthRecords;

    // 上传用户的健康数据
    function uploadHealthData(uint heartRate) public {
        // 存储数据
        HealthData memory newData = HealthData({
            heartRate: heartRate,
            timestamp: block.timestamp
        });
        userHealthRecords[msg.sender].push(newData);

        // 触发事件
        emit DataUploaded(msg.sender, heartRate, block.timestamp);
    }

    // 获取用户的所有健康数据
    function getUserHealthData(address user) public view returns (HealthData[] memory) {
        return userHealthRecords[user];
    }

    // 获取用户最近的一条健康数据
    function getLatestHealthData(address user) public view returns (uint, uint) {
        uint length = userHealthRecords[user].length;
        require(length > 0, "No health data available");
        HealthData memory latestData = userHealthRecords[user][length - 1];
        return (latestData.heartRate, latestData.timestamp);
    }
}
