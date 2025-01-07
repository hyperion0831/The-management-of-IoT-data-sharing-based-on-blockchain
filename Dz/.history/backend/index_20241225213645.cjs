var localhost = "http://127.0.0.1:7545"
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider(localhost))
web3.eth.getAccounts(function (error, result) {
    console.log("账户列表地址：");
    console.log(result);
});
