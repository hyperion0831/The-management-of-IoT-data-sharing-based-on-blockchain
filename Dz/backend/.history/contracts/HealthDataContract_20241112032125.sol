// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthDataContract {
    event DataUploaded(address indexed user, uint heartRate);

    function uploadHealthData(uint heartRate) public {
        emit DataUploaded(msg.sender, heartRate);
    }
}
