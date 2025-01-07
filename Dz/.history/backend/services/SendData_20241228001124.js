import Web3 from 'web3';
import { execFile } from 'child_process'; // 用于调用 Python 脚本


const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// 获取合约实例
import contractABI from '../contracts/abi/Ganache.json' assert { type: 'json' }; // 使用 assert 声明 JSON 格式
const contractAddress = '0xb51F67Cf19475149Bd707F4f35eAb76846C563e1';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Ganache 账户，1测试，2实盘
const accounts_1 = '0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762';

// 调用 Python 脚本转换 Excel 为 JSON
function convertExcelToJson(filePath) {
  return new Promise((resolve, reject) => {
    // 调用 transfer.py 脚本
    execFile('python', ['../transfer.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('调用 Python 脚本失败:', stderr);
        return reject(error);
      }
      try {
        // 解析脚本输出的 JSON 数据
        const jsonData = JSON.parse(stdout);
        resolve(jsonData);
      } catch (parseError) {
        console.error('解析 Python 输出 JSON 数据失败:', parseError.message);
        reject(parseError);
      }
    });
  });
}

// 上传健康数据到区块链
async function uploadHealthData(filePath) {
  try {
    // 调用 transfer.py 转换 Excel 文件为 JSON 数据
    const jsonData = await convertExcelToJson(filePath);

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
      gas: 3000000
    });

    console.log('数据上传成功:', receipt);
    return { status: 'success', transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error('上传数据到区块链失败:', error.message);
    throw new Error('上传数据到区块链失败');
  }
}

// 示例：上传本地文件
uploadHealthData('../contracts/data/heart_rate_data.xlsx');
