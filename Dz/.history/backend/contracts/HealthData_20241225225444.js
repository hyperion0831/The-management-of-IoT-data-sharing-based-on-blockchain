// contracts/MyContract.js
import Web3 from 'web3';
import ContractABI from './abi/HealthDataContract.json'; // 导入 ABI

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); // 连接到 Ganache
const contractAddress = '0xYourDeployedContractAddress'; // 部署的合约地址
const contract = new web3.eth.Contract(ContractABI, contractAddress);

export const callSomeFunction = async (account, arg1, arg2) => {
    try {
        const result = await contract.methods.someFunction(arg1, arg2).call({ from: account });
        return result;
    } catch (error) {
        console.error('Error calling someFunction:', error);
        throw error;
    }
};

export const sendTransaction = async (account, arg1, arg2) => {
    try {
        const receipt = await contract.methods.someFunction(arg1, arg2).send({
            from: account,
            gas: 1500000
        });
        return receipt;
    } catch (error) {
        console.error('Error sending transaction:', error);
        throw error;
    }
};
