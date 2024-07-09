import Web3 from 'web3';
import contractABIJson from './build/contracts/MyNFT.json' assert { type: 'json' };

console.log("Web3 module loaded");

const contractABI = contractABIJson.abi;
console.log("Contract ABI loaded");

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.error('MetaMask is not installed. Please install MetaMask and try again.');
    return;
}

// Create a Web3 instance using MetaMask's provider
const web3 = new Web3(window.ethereum);
console.log("Web3 instance created");

const contractAddress = '0xa6de6a71832bfa02f53dd85d29949d13c91fba17'; // Replace with your contract address
console.log("Contract address set");

const contract = new web3.eth.Contract(contractABI, contractAddress);
console.log("Contract instance created");

// Request account access if needed
async function requestAccount() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    } catch (error) {
        console.error('User denied account access');
        throw error;
    }
}

async function transferNFT(sender, recipient, tokenId) {
    try {
        const receipt = await contract.methods.transferFrom(sender, recipient, tokenId).send({ from: sender, gas: 3000000 });
        console.log(`NFT transferred successfully. Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error transferring NFT: ${error}`);
    }
}

async function main() {
    try {
        const senderAddress = await requestAccount(); // Get the sender address from MetaMask
        const recipientAddress = '0x4a7d5B31308C2614d96142CC028fcE12305c5aD4'; // Replace with the recipient address
        const tokenId = 1; // Replace with the token ID of the NFT you want to transfer

        // Transfer the NFT
        await transferNFT(senderAddress, recipientAddress, tokenId);
    } catch (error) {
        console.error('Error during NFT transfer:', error);
    }
}

main();
