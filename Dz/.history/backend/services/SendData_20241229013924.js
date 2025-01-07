import Web3 from 'web3';
import XLSX from 'xlsx'; // 用于解析 Excel 文件

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// 获取合约实例
import contractABI from '../contracts/abi/Ganache.json' assert { type: 'json' }; // 使用 assert 声明 JSON 格式
const contractAddress = '0x4a022658b510dd5Dbc357DCa38505367e55d5ea2';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Ganache 账户，1测试，2实盘
const accounts_1 = '0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762';

// 解析 Excel 文件并转换为 JSON
function parseExcelToJson(filePath) {
  try {
    // 读取 Excel 文件
    const workbook = XLSX.readFile(filePath);
    // 假设数据在第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // 转换工作表为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    console.log('解析 Excel 文件成功:');
    return jsonData;
  } catch (error) {
    console.error('解析 Excel 文件失败:', error.message);
    throw new Error('解析 Excel 文件失败');
  }
}

// 上传健康数据到区块链
async function uploadHealthData(filePath) {
  try {
    // 解析 Excel 文件为 JSON 数据
    const jsonData = parseExcelToJson(filePath);

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
    console.log('交易成功，交易哈希:', receipt.transactionHash);
    console.log(receipt); // 打印完整的交易信息
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
