const Jobs = artifacts.require('Jobs');

module.exports = function (deployer) {
  deployer.deploy(Jobs);
}
