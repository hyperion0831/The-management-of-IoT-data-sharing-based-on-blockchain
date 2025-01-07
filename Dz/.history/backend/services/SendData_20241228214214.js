import Web3 from 'web3';
import { execFile } from 'child_process'; // 用于调用 Python 脚本


const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// 获取合约实例
import contractABI from '../contracts/abi/Ganache.json' assert { type: 'json' }; // 使用 assert 声明 JSON 格式
const contractAddress = '0x4250C098E094293e8A27B31e6789be71d77A53A4';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Ganache 账户，1测试，2实盘
const accounts_1 = '0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762';

// 调用 Python 脚本转换 Excel 为 JSON
function convertExcelToJson(filePath) {
  return new Promise((resolve, reject) => {
    // 调用 transfer.py 脚本
    execFile('python', ['../tools/Transfer.py', filePath], (error, stdout, stderr) => {
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
      gas: 6000000, // 提高 gas 限制
      gasPrice: await web3.eth.getGasPrice() // 自动获取当前 gas 价格
    });

    // 输出交易哈希到标准输出
    console.log(receipt.transactionHash);
    return receipt.transactionHash; // 如果有程序调用时需要值，也可以通过返回值提供
  } catch (error) {
    console.error('上传数据到区块链失败:', error.message);
    throw new Error('上传数据到区块链失败');
  }
}

// 从命令行获取文件路径
const filePath = process.argv[2];
if (filePath) {
  uploadHealthData(filePath)
    .then((result) => {
      console.log('上传完成:', result);
    })
    .catch((error) => {
      console.error('上传失败:', error.message);
    });
} else {
  console.error('请提供文件路径作为参数！');
}