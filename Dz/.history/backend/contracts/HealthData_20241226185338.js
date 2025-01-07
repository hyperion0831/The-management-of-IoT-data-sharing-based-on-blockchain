// contracts/MyContract.js
import Web3 from 'web3';
import ContractABI from './abi/HealthDataContract.json'; // 导入 ABI

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); // 连接到 Ganache
const contractAddress = '0x4fe93e15af988965d7ff44f86f4b185344db1ab794766a536329d586bc9c4a19'; // 部署的合约地址
const contract = new web3.eth.Contract(ContractABI, contractAddress);

// 后端发送数据到合约
async function sendDataToContract(data) {
    try {
        // 获取账户（从 Ganache 或 MetaMask 配置中）
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0]; // 使用第一个账户发送交易

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