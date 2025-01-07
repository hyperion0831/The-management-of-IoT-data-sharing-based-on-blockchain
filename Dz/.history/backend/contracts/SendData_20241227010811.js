const fs = require('fs');
const contractABI = require('./abi/Ganache.json'); // 合约 ABI
const contractAddress = '0xYourContractAddressHere';
const Web3 = require('web3');
const XLSX = require('xlsx');

//后端发送数据给合约
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