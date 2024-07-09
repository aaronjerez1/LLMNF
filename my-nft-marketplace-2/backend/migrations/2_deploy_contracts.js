const MyNFT = artifacts.require("MyNFT");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function(deployer, network, accounts) {
  const initialOwner = accounts[0]; // Use the first account as the initial owner

  // Deploy MyNFT contract
  await deployer.deploy(MyNFT, initialOwner);
  const myNFTInstance = await MyNFT.deployed();

  // Deploy NFTMarketplace contract
  await deployer.deploy(NFTMarketplace, initialOwner);
  const nftMarketplaceInstance = await NFTMarketplace.deployed();

  console.log("MyNFT deployed at address:", myNFTInstance.address);
  console.log("NFTMarketplace deployed at address:", nftMarketplaceInstance.address);
};
