import Web3 from 'web3';
import contractABIJson from './build/contracts/MyNFT.json' assert { type: 'json' };

console.log("Web3 module loaded");

const contractABI = contractABIJson.abi;
console.log("Contract ABI loaded");

const web3 = new Web3('http://127.0.0.1:8545');
console.log("Web3 instance created");

const contractAddress = '0xa6de6a71832bfa02f53dd85d29949d13c91fba17'; // Replace with your contract address
console.log("Contract address set");

const contract = new web3.eth.Contract(contractABI, contractAddress);
console.log("Contract instance created");

async function transferNFT(sender, recipient, tokenId) {
    try {
        const receipt = await contract.methods.transferFrom(sender, recipient, tokenId).send({ from: sender, gas: 3000000  });
        console.log(`NFT transferred successfully. Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error transferring NFT: ${error}`);
    }
}

// Example usage
const senderAddress = '0xa1b5804F194cc47819a8467dF09a06Bb9EC4EDFc'; // Replace with the current owner address
const recipientAddress = '0x4a7d5B31308C2614d96142CC028fcE12305c5aD4'; // Replace with the recipient address
const tokenId = 1; // Replace with the token ID of the NFT you want to transfer

transferNFT(senderAddress, recipientAddress, tokenId);