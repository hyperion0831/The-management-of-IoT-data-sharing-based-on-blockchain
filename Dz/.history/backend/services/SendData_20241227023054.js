//通过合约进行交易，也就是数据上链


import Web3 from 'web3';
import fs from 'fs';
import XLSX from 'xlsx';

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

//获取合约实例
import contractABI from '../abi/Ganache.json' assert { type: 'json' }; // 使用 assert 声明 JSON 格式
const contractAddress = '0x0Ed719621417a7AFD5178Ac24625Ddd16b9d2Fa3';
const contract = new web3.eth.Contract(contractABI, contractAddress);

//ganache账户，1测试，2实盘
var accounts_1 = "0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";


//后端发送数据给合约
async function uploadData(filePath) {
    // 解析 .xlsx 文件
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // 读取第一个工作表
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 准备数据
    const ids = [];
    const contents = [];
    sheet.forEach((row, index) => {
        ids.push(index + 1); // 假设每行一个唯一 ID
        contents.push(JSON.stringify(row)); // 将每行转换为 JSON 字符串
    });

    // 与合约交互
    const receipt = await contract.methods.uploadData(ids, contents).send({
        from: accounts_1,
        gas: 3000000
    });

    console.log('数据上传成功:', receipt);
}

// 示例：上传本地文件
uploadData('./data/heart_rate_data.xlsx');


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
