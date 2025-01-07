import Web3 from "web3";

const localhost = "http://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));

//ganache账户，1测试，2实盘
var accounts_1 = "0x30E33Ac462Ab2f1c1Eb1eAA73212CaBbA4F6f327";
var accounts_2 = "0x0f2340ce74265F9d9512c938547F3C1A64242C8a";

//合约地址：0x4fe93e15af988965d7ff44f86f4b185344db1ab794766a536329d586bc9c4a19
var contractAddress = "0x4fe93e15af988965d7ff44f86f4b185344db1ab794766a536329d586bc9c4a19";

//验证 Ganache 配置和连接
web3.eth.net.isListening()
    .then(() => console.log("Connected to Ganache"))
    .catch((error) => console.error("Connection error:", error));

//部署智能合约上链，获取合约地址
var datacontractContract = new web3.eth.Contract([{"inputs":[],"name":"data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retrieveData","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_data","type":"string"}],"name":"storeData","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var datacontract = datacontractContract.deploy({
     data: '0x6080604052348015600f57600080fd5b506107338061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806351e0556d1461004657806373d4a13a14610064578063fb218f5f14610082575b600080fd5b61004e61009e565b60405161005b9190610261565b60405180910390f35b61006c610130565b6040516100799190610261565b60405180910390f35b61009c600480360381019061009791906103cc565b6101be565b005b6060600080546100ad90610444565b80601f01602080910402602001604051908101604052809291908181526020018280546100d990610444565b80156101265780601f106100fb57610100808354040283529160200191610126565b820191906000526020600020905b81548152906001019060200180831161010957829003601f168201915b5050505050905090565b6000805461013d90610444565b80601f016020809104026020016040519081016040528092919081815260200182805461016990610444565b80156101b65780601f1061018b576101008083540402835291602001916101b6565b820191906000526020600020905b81548152906001019060200180831161019957829003601f168201915b505050505081565b80600090816101cd919061062b565b5050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561020b5780820151818401526020810190506101f0565b60008484015250505050565b6000601f19601f8301169050919050565b6000610233826101d1565b61023d81856101dc565b935061024d8185602086016101ed565b61025681610217565b840191505092915050565b6000602082019050818103600083015261027b8184610228565b905092915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102d982610217565b810181811067ffffffffffffffff821117156102f8576102f76102a1565b5b80604052505050565b600061030b610283565b905061031782826102d0565b919050565b600067ffffffffffffffff821115610337576103366102a1565b5b61034082610217565b9050602081019050919050565b82818337600083830152505050565b600061036f61036a8461031c565b610301565b90508281526020810184848401111561038b5761038a61029c565b5b61039684828561034d565b509392505050565b600082601f8301126103b3576103b2610297565b5b81356103c384826020860161035c565b91505092915050565b6000602082840312156103e2576103e161028d565b5b600082013567ffffffffffffffff811115610400576103ff610292565b5b61040c8482850161039e565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061045c57607f821691505b60208210810361046f5761046e610415565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026104d77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261049a565b6104e1868361049a565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061052861052361051e846104f9565b610503565b6104f9565b9050919050565b6000819050919050565b6105428361050d565b61055661054e8261052f565b8484546104a7565b825550505050565b600090565b61056b61055e565b610576818484610539565b505050565b5b8181101561059a5761058f600082610563565b60018101905061057c565b5050565b601f8211156105df576105b081610475565b6105b98461048a565b810160208510156105c8578190505b6105dc6105d48561048a565b83018261057b565b50505b505050565b600082821c905092915050565b6000610602600019846008026105e4565b1980831691505092915050565b600061061b83836105f1565b9150826002028217905092915050565b610634826101d1565b67ffffffffffffffff81111561064d5761064c6102a1565b5b6106578254610444565b61066282828561059e565b600060209050601f8311600181146106955760008415610683578287015190505b61068d858261060f565b8655506106f5565b601f1984166106a386610475565b60005b828110156106cb578489015182556001820191506020850194506020810190506106a6565b868310156106e857848901516106e4601f8916826105f1565b8355505b6001600288020188555050505b50505050505056fea264697066735822122011b8b25bf52ddd2ea4ac728a1b406dcbc2e28ad85ac2b5053f520874a38612c064736f6c634300081a0033', 
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