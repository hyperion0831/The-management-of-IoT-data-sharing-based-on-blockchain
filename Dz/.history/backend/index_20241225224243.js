import Web3 from "web3";

const localhost = "http://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));

//ganache账户，1测试，2实盘
var accounts_1 = "0x30E33Ac462Ab2f1c1Eb1eAA73212CaBbA4F6f327";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";

//验证 Ganache 配置和连接
web3.eth.net.isListening()
    .then(() => console.log("Connected to Ganache"))
    .catch((error) => console.error("Connection error:", error));

