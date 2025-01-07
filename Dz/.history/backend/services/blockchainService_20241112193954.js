// backend/services/blockchainService.js
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// 连接到本地以太坊节点
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // 连接本地以太坊节点

// 加载智能合约 ABI 和地址
const contractABIPath = path.join(__dirname, '../build/contracts/HealthDataContract.json');

let contractABI;
let contractAddress;

try {
  // 读取合约 JSON 文件
  const contractData = JSON.parse(fs.readFileSync(contractABIPath, 'utf-8'));
  
  // 获取 ABI
  contractABI = contractData.abi;

  // 获取合约地址
  const networkId = Object.keys(contractData.networks)[0]; // 获取第一个网络ID
  contractAddress = contractData.networks[networkId].address;

  if (!contractABI || !contractAddress) {
    throw new Error('ABI 或合约地址加载失败');
  }
} catch (error) {
  console.error('加载智能合约 ABI 和地址失败:', error);
  throw error;
}

const contract = new web3.eth.Contract(contractABI, contractAddress);

// 上传健康数据的方法
async function uploadHealthData(user, healthData, timestamp) {
  try {
    const accounts = await web3.eth.getAccounts();  // 获取账户
    const tx = await contract.methods.uploadHealthData(healthData.heartRate)
    .send({ from: accounts[0] });

    console.log('数据上传成功, 交易哈希:', tx.transactionHash);
    return { status: 'success', transactionHash: tx.transactionHash };
  } catch (error) {
    console.error('上传数据到区块链失败:', error);
    throw new Error('上传数据到区块链失败');
  }
}

module.exports = {
  uploadHealthData,
};
