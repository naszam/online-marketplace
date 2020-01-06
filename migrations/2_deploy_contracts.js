var Marketplace = artifacts.require("Marketplace");
var Stores = artifacts.require("Stores");

module.exports = function(deployer) {
	deployer.deploy(Marketplace);
	deployer.deploy(Stores);
}
