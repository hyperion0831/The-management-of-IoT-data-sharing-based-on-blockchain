// Ganache 地址
var localhost = "http://127.0.0.1:7545";

// 引入 Web3.js
var Web3 = require("web3");

// 初始化 Web3 实例
var web3 = new Web3(new Web3.providers.HttpProvider(localhost));

// 获取账户列表
web3.eth.getAccounts()
    .then(accounts => {
        console.log("账户列表地址：", accounts);
    })
    .catch(error => {
        console.error("获取账户时出错：", error.message);
    });
