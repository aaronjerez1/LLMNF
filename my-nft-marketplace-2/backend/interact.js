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

async function getAccounts() {
    return await web3.eth.getAccounts();
}

async function mintNFT(recipient, tokenURI) {
    const accounts = await getAccounts();
    const sender = accounts[0];

    try {
        const receipt = await contract.methods.mintNFT(recipient, tokenURI).send({ from: sender, gas: 3000000 });
        const tokenId = receipt.events.Transfer.returnValues.tokenId;
        console.log(`NFT minted successfully. Token ID: ${tokenId}`);
        return tokenId;
    } catch (error) {
        console.error(`Error minting NFT: ${error}`);
    }
}

async function getTokenURI(tokenId) {
    try {
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
    } catch (error) {
        console.error(`Error getting token URI: ${error}`);
    }
}

async function main() {
    const recipientAddress = '0xa1b5804F194cc47819a8467dF09a06Bb9EC4EDFc'; // Replace with the recipient address
    const exampleTokenURI = 'https://huggingface.co/dfurman/Mistral-7B-Instruct-v0.3-mlx-4bit';

    // Mint a new NFT
    const tokenId = await mintNFT(recipientAddress, exampleTokenURI);

    // Get the token URI
    if (tokenId) {
        await getTokenURI(tokenId);
    }
}

main();
