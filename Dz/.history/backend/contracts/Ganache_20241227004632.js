const fs = require('fs');
const XLSX = require('xlsx');
const Web3 = require('web3');
const contractABI = require('./abi/Ganache.json'); // 合约 ABI
const contractAddress = '0xYourContractAddressHere';

// 连接到 Ganache 或其他节点
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const contract = new web3.eth.Contract(contractABI, contractAddress);

//ganache账户，1测试，2实盘
var accounts_1 = "0x30E33Ac462Ab2f1c1Eb1eAA73212CaBbA4F6f327";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";


async function uploadExcel(filePath) {
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
uploadExcel('./data/example.xlsx');
