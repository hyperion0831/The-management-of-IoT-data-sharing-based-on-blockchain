// backend/services/blockchainService.js
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // 连接本地以太坊节点

const contractABI = [ /* 合约 ABI */ ];  // 在此填入智能合约的 ABI
const contractAddress = "你的智能合约地址";  // 填入你的智能合约地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 上传健康数据的方法
async function uploadHealthData(user, healthData, timestamp) {
  try {
    const accounts = await web3.eth.getAccounts();  // 获取账户
    const tx = await contract.methods.uploadHealthData(healthData.heartRate).send({ from: accounts[0] });
    return tx;
  } catch (error) {
    console.error('上传数据到区块链失败:', error);
    throw new Error('上传数据到区块链失败');
  }
}

module.exports = {
  uploadHealthData,
};
