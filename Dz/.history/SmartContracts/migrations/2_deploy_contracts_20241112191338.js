// 2_deploy_contracts.js
const HealthDataContract = artifacts.require("HealthDataContract");

module.exports = function (deployer) {
  deployer.deploy(HealthDataContract);
};
