//获取智能合约地址

import Web3 from 'web3';
// 连接到 Ganache 或其他节点
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

//ganache账户，1测试，2实盘
var accounts_1 = "0xaE5E0ae67250aE6b078C5345000B6D3b2d0b0762";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";

//验证 Ganache 配置和连接
web3.eth.net.isListening()
    .then(() => console.log("Connected to Ganache"))
    .catch((error) => console.error("Connection error:", error));

//web3部署合约
var ganacheContract = new web3.eth.Contract([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"content","type":"string"}],"name":"DataUploaded","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataStore","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"content","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"string[]","name":"contents","type":"string[]"}],"name":"uploadData","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var ganache = ganacheContract.deploy({
     data: '0x6080604052348015600f57600080fd5b50610bd68061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80630178fe3f146100465780634239dda714610077578063da6ea12a14610093575b600080fd5b610060600480360381019061005b91906103b3565b6100c4565b60405161006e92919061047f565b60405180910390f35b610091600480360381019061008c919061078d565b610199565b005b6100ad60048036038101906100a891906103b3565b6102bd565b6040516100bb92919061047f565b60405180910390f35b6000606060008060008581526020019081526020016000206040518060400160405290816000820154815260200160018201805461010190610834565b80601f016020809104026020016040519081016040528092919081815260200182805461012d90610834565b801561017a5780601f1061014f5761010080835404028352916020019161017a565b820191906000526020600020905b81548152906001019060200180831161015d57829003601f168201915b5050505050815250509050806000015181602001519250925050915091565b80518251146101dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101d4906108b1565b60405180910390fd5b60005b82518110156102b85760008382815181106101fe576101fd6108d1565b5b60200260200101519050600083838151811061021d5761021c6108d1565b5b6020026020010151905060405180604001604052808381526020018281525060008084815260200190815260200160002060008201518160000155602082015181600101908161026d9190610aac565b50905050817fc0e0b61fdf197e2d9f992779958b36d39f436794b2669aa8d1348b1583bf38f8826040516102a19190610b7e565b60405180910390a2505080806001019150506101e0565b505050565b60006020528060005260406000206000915090508060000154908060010180546102e690610834565b80601f016020809104026020016040519081016040528092919081815260200182805461031290610834565b801561035f5780601f106103345761010080835404028352916020019161035f565b820191906000526020600020905b81548152906001019060200180831161034257829003601f168201915b5050505050905082565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6103908161037d565b811461039b57600080fd5b50565b6000813590506103ad81610387565b92915050565b6000602082840312156103c9576103c8610373565b5b60006103d78482850161039e565b91505092915050565b6103e98161037d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561042957808201518184015260208101905061040e565b60008484015250505050565b6000601f19601f8301169050919050565b6000610451826103ef565b61045b81856103fa565b935061046b81856020860161040b565b61047481610435565b840191505092915050565b600060408201905061049460008301856103e0565b81810360208301526104a68184610446565b90509392505050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6104ec82610435565b810181811067ffffffffffffffff8211171561050b5761050a6104b4565b5b80604052505050565b600061051e610369565b905061052a82826104e3565b919050565b600067ffffffffffffffff82111561054a576105496104b4565b5b602082029050602081019050919050565b600080fd5b600061057361056e8461052f565b610514565b905080838252602082019050602084028301858111156105965761059561055b565b5b835b818110156105bf57806105ab888261039e565b845260208401935050602081019050610598565b5050509392505050565b600082601f8301126105de576105dd6104af565b5b81356105ee848260208601610560565b91505092915050565b600067ffffffffffffffff821115610612576106116104b4565b5b602082029050602081019050919050565b600080fd5b600067ffffffffffffffff821115610643576106426104b4565b5b61064c82610435565b9050602081019050919050565b82818337600083830152505050565b600061067b61067684610628565b610514565b90508281526020810184848401111561069757610696610623565b5b6106a2848285610659565b509392505050565b600082601f8301126106bf576106be6104af565b5b81356106cf848260208601610668565b91505092915050565b60006106eb6106e6846105f7565b610514565b9050808382526020820190506020840283018581111561070e5761070d61055b565b5b835b8181101561075557803567ffffffffffffffff811115610733576107326104af565b5b80860161074089826106aa565b85526020850194505050602081019050610710565b5050509392505050565b600082601f830112610774576107736104af565b5b81356107848482602086016106d8565b91505092915050565b600080604083850312156107a4576107a3610373565b5b600083013567ffffffffffffffff8111156107c2576107c1610378565b5b6107ce858286016105c9565b925050602083013567ffffffffffffffff8111156107ef576107ee610378565b5b6107fb8582860161075f565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061084c57607f821691505b60208210810361085f5761085e610805565b5b50919050565b7f49447320616e6420636f6e74656e7473206c656e677468206d69736d61746368600082015250565b600061089b6020836103fa565b91506108a682610865565b602082019050919050565b600060208201905081810360008301526108ca8161088e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026109627fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610925565b61096c8683610925565b95508019841693508086168417925050509392505050565b6000819050919050565b60006109a96109a461099f8461037d565b610984565b61037d565b9050919050565b6000819050919050565b6109c38361098e565b6109d76109cf826109b0565b848454610932565b825550505050565b600090565b6109ec6109df565b6109f78184846109ba565b505050565b5b81811015610a1b57610a106000826109e4565b6001810190506109fd565b5050565b601f821115610a6057610a3181610900565b610a3a84610915565b81016020851015610a49578190505b610a5d610a5585610915565b8301826109fc565b50505b505050565b600082821c905092915050565b6000610a8360001984600802610a65565b1980831691505092915050565b6000610a9c8383610a72565b9150826002028217905092915050565b610ab5826103ef565b67ffffffffffffffff811115610ace57610acd6104b4565b5b610ad88254610834565b610ae3828285610a1f565b600060209050601f831160018114610b165760008415610b04578287015190505b610b0e8582610a90565b865550610b76565b601f198416610b2486610900565b60005b82811015610b4c57848901518255600182019150602085019450602081019050610b27565b86831015610b695784890151610b65601f891682610a72565b8355505b6001600288020188555050505b505050505050565b60006020820190508181036000830152610b988184610446565b90509291505056fea2646970667358221220475284bf4c0f6517f1078e345a7943c572df82a48ecc5d1110e154bc8634823864736f6c634300081a0033', 
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
 
