import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 连接到本地以太坊节点
const web3 = new Web3('http://localhost:8545');

// 获取 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载智能合约 ABI 和地址
const contractABIPath = path.join(__dirname, '../build/contracts/HealthDataContract.json');

let contractABI;
let contractAddress;

try {
  // 读取并解析合约 JSON 文件
  const contractData = JSON.parse(fs.readFileSync(contractABIPath, 'utf-8'));

  // 获取 ABI
  contractABI = contractData.abi;

  // 明确获取网络 ID（可通过环境变量指定）
  const networkId = process.env.NETWORK_ID || Object.keys(contractData.networks)[0];
  contractAddress = contractData.networks[networkId]?.address;
  console.log('ABI 文件路径:', contractABIPath);
  console.log('networkId:', networkId);
  console.log('contractData.networks:', contractData.networks);
  
  if (!contractABI || !contractAddress) {
    console.error('ABI 或合约地址加载失败');
    throw new Error('ABI 或合约地址加载失败');
  }
} catch (error) {
  console.error('加载智能合约 ABI 和地址失败:', error);
  throw error;
}

// 初始化合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 上传健康数据到区块链
export default async function uploadHealthData(user, healthData, timestamp) {
  try {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0]; // 使用第一个账户作为发送者

    // 通过合约方法上传数据（支持多个健康数据字段）
    const tx = await contract.methods.uploadHealthData(
      healthData.heartRate,
      healthData.bloodPressure || '', // 血压数据
      healthData.temperature || 0, // 体温数据
      timestamp
    ).send({
      from: sender,
      gas: 3000000, // 设置 gas limit
      gasPrice: await web3.eth.getGasPrice() // 获取当前 gas 价格
    });

    console.log('数据上传成功, 交易哈希:', tx.transactionHash);
    return { status: 'success', transactionHash: tx.transactionHash };
  } catch (error) {
    console.error('上传数据到区块链失败:', error.message);
    throw new Error('上传数据到区块链失败');
  }
}
