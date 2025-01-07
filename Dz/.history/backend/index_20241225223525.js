import Web3 from "web3";

const localhost = "http://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));


var accounts_1 = "0x30E33Ac462Ab2f1c1Eb1eAA73212CaBbA4F6f327";
var contractAddress = "0x601658483FD106cBf4B19071263a4550d6b126dc";
var data = '0x6080604052348015600f57600080fd5b506101508061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220e004e42fbb29d3fd5cda19e1b3696a32da5462640d6b6d5d01b3c780c59d839064736f6c634300081a0033';

var Storage_Contract = new web3.eth.Contract(contractABI, contractAddress)

Storage_Contract.methods.store(10000000000).send({ from : account_1}, function (error, result) {
    console.log("结果_store：" + result);  // acount_1调用合约的store方法存值
})

// Storage_Contract.methods.retrieve().call({ from : account_1}, function(error, result) {
//      console.log("结果_retrieve： " + result);
// })


    var storageContract = new web3.eth.Contract([{"inputs":[],"name":"retrieve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"store","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
    var storage = storageContract.deploy({
         data: '0x6080604052348015600f57600080fd5b506101508061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220e004e42fbb29d3fd5cda19e1b3696a32da5462640d6b6d5d01b3c780c59d839064736f6c634300081a0033', 
         arguments: [
         ]
    }).send({
         from: accounts_1, 
         gas: '4700000'
       }, function (e, contract){
        console.log(e, contract);
        if (typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        }
     })

    var contractABI = [
        {
            "inputs": [],
            "name": "retrieve",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "num",
                    "type": "uint256"
                }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

