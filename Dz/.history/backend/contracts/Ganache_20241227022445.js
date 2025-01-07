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
var healthdatacontractContract = new web3.eth.Contract([{"inputs":[],"name":"jsonData1","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jsonData2","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retrieveJsonData1","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retrieveJsonData2","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_data","type":"string"}],"name":"storeJsonData1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_data","type":"string"}],"name":"storeJsonData2","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var healthdatacontract = healthdatacontractContract.deploy({
     data: '0x6080604052348015600f57600080fd5b506108df8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80633856fd701461006757806369e591f714610083578063ab61d4f4146100a1578063ae35e645146100bf578063b66b203b146100db578063d964df34146100f9575b600080fd5b610081600480360381019061007c91906104d7565b610117565b005b61008b61012a565b604051610098919061059f565b60405180910390f35b6100a96101b8565b6040516100b6919061059f565b60405180910390f35b6100d960048036038101906100d491906104d7565b61024a565b005b6100e361025d565b6040516100f0919061059f565b60405180910390f35b6101016102eb565b60405161010e919061059f565b60405180910390f35b806001908161012691906107d7565b5050565b60008054610137906105f0565b80601f0160208091040260200160405190810160405280929190818152602001828054610163906105f0565b80156101b05780601f10610185576101008083540402835291602001916101b0565b820191906000526020600020905b81548152906001019060200180831161019357829003601f168201915b505050505081565b6060600180546101c7906105f0565b80601f01602080910402602001604051908101604052809291908181526020018280546101f3906105f0565b80156102405780601f1061021557610100808354040283529160200191610240565b820191906000526020600020905b81548152906001019060200180831161022357829003601f168201915b5050505050905090565b806000908161025991906107d7565b5050565b6001805461026a906105f0565b80601f0160208091040260200160405190810160405280929190818152602001828054610296906105f0565b80156102e35780601f106102b8576101008083540402835291602001916102e3565b820191906000526020600020905b8154815290600101906020018083116102c657829003601f168201915b505050505081565b6060600080546102fa906105f0565b80601f0160208091040260200160405190810160405280929190818152602001828054610326906105f0565b80156103735780601f1061034857610100808354040283529160200191610373565b820191906000526020600020905b81548152906001019060200180831161035657829003601f168201915b5050505050905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6103e48261039b565b810181811067ffffffffffffffff82111715610403576104026103ac565b5b80604052505050565b600061041661037d565b905061042282826103db565b919050565b600067ffffffffffffffff821115610442576104416103ac565b5b61044b8261039b565b9050602081019050919050565b82818337600083830152505050565b600061047a61047584610427565b61040c565b90508281526020810184848401111561049657610495610396565b5b6104a1848285610458565b509392505050565b600082601f8301126104be576104bd610391565b5b81356104ce848260208601610467565b91505092915050565b6000602082840312156104ed576104ec610387565b5b600082013567ffffffffffffffff81111561050b5761050a61038c565b5b610517848285016104a9565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561055a57808201518184015260208101905061053f565b60008484015250505050565b600061057182610520565b61057b818561052b565b935061058b81856020860161053c565b6105948161039b565b840191505092915050565b600060208201905081810360008301526105b98184610566565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061060857607f821691505b60208210810361061b5761061a6105c1565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610646565b61068d8683610646565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106d46106cf6106ca846106a5565b6106af565b6106a5565b9050919050565b6000819050919050565b6106ee836106b9565b6107026106fa826106db565b848454610653565b825550505050565b600090565b61071761070a565b6107228184846106e5565b505050565b5b818110156107465761073b60008261070f565b600181019050610728565b5050565b601f82111561078b5761075c81610621565b61076584610636565b81016020851015610774578190505b61078861078085610636565b830182610727565b50505b505050565b600082821c905092915050565b60006107ae60001984600802610790565b1980831691505092915050565b60006107c7838361079d565b9150826002028217905092915050565b6107e082610520565b67ffffffffffffffff8111156107f9576107f86103ac565b5b61080382546105f0565b61080e82828561074a565b600060209050601f831160018114610841576000841561082f578287015190505b61083985826107bb565b8655506108a1565b601f19841661084f86610621565b60005b8281101561087757848901518255600182019150602085019450602081019050610852565b868310156108945784890151610890601f89168261079d565b8355505b6001600288020188555050505b50505050505056fea26469706673582212207692947838d74ce487a67afc6054b0db9f651f400bfaf253eb04bcb1c64671cf64736f6c634300081a0033', 
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
 
