import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// 获取合约实例
import contractABI from '../contracts/abi/Ganache.json' assert { type: 'json' }; // 使用 assert 声明 JSON 格式
const contractAddress = '0xb51F67Cf19475149Bd707F4f35eAb76846C563e1';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Ganache 账户，1测试，2实盘
const accounts_1 = '0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762';


// 引入文件系统模块
import fs from 'fs';
import * as XLSX from 'xlsx'; // 用于解析 Excel 文件

// 上传健康数据到区块链
async function uploadHealthData(filePath) {
  try {
    // 调用 transfer.py 转换 Excel 文件为 JSON 数据
    const jsonData = await convertExcelToJson(filePath);

    df = pd.read_excel("data.xlsx")
    data_array = df.to_json()
    // 准备数据
    const ids = [];
    const contents = [];
    jsonData.forEach((row, index) => {
      ids.push(index + 1); // 假设每行一个唯一 ID
      contents.push(JSON.stringify(row)); // 将每行转换为 JSON 字符串
    });

    // 与合约交互
    const receipt = await contract.methods.uploadData(ids, contents).send({
      from: accounts_1,
      gas: 6000000, // 提高 gas 限制
      gasPrice: await web3.eth.getGasPrice() // 自动获取当前 gas 价格
    });

    console.log('数据上传成功:', receipt);
    return { status: 'success', transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error('上传数据到区块链失败:', error.message);
    throw new Error('上传数据到区块链失败');
  }
}

// 示例：上传本地文件
uploadHealthData('../dataset/heart.xlsx');
