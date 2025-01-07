// contracts/MyContract.js
import Web3 from 'web3';
import ContractABI from './abi/HealthDataContract.json'; // 导入 ABI

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); // 连接到 Ganache
const contractAddress = '0x4fe93e15af988965d7ff44f86f4b185344db1ab794766a536329d586bc9c4a19'; // 部署的合约地址
const contract = new web3.eth.Contract(ContractABI, contractAddress);

//ganache账户，1测试，2实盘
var accounts_1 = "0x30E33Ac462Ab2f1c1Eb1eAA73212CaBbA4F6f327";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";

// 后端发送数据到合约
async function sendDataToContract(data) {
    try {
        const sender = accounts_1; // 使用第一个账户发送交易

        // 调用合约的方法（setData）
        const receipt = await contract.methods.setData(data).send({
            from: sender,
            gas: 2000000 // 设置足够的 gas 限制
        });

        console.log("交易成功：", receipt);
    } catch (error) {
        console.error("发送数据到合约时出错：", error);
    }
}

// 测试发送数据
sendDataToContract("Hello Blockchain");