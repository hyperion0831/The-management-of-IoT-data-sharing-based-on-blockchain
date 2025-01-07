import Web3 from "web3";

const localhost = "http://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));

web3.eth.getAccounts()
    .then(accounts => {
        console.log("账户列表地址：", accounts);
    })
    .catch(error => {
        console.error("获取账户时出错：", error.message);
    });
