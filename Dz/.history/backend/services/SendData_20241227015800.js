//通过合约进行交易，也就是数据上链


const fs = require('fs');
const Web3 = require('web3');
const XLSX = require('xlsx');


const contractABI = require('./abi/Ganache.json'); // 合约 ABI
const contractAddress = '0x5D83198D57D920191B00c18359DCa57b79128943'; // 合约地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

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
    const accounts = await web3.eth.getAccounts();
    const receipt = await contract.methods.uploadData(ids, contents).send({
        from: accounts[0],
        gas: 3000000
    });

    console.log('数据上传成功:', receipt);
}

// 示例：上传本地文件
uploadExcel('./data/heart_rate_data.xlsx');


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
