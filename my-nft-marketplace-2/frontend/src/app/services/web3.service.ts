// src/app/web3.service.ts

import { Injectable } from '@angular/core';
import Web3 from 'web3';
import nftABI from '../../assets/MyNFT.json'; // Adjust the path as needed
import marketplaceABI from '../../assets/NFTMarketplace.json'; // Add your marketplace ABI
import { NFT } from 'opensea-js';
import { Nft } from './web3.model';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3!: Web3;
  private nftContract: any;
  private marketplaceContract: any;
  private nftContractAddress = '0xA32943F9d288b0C1bC72F2923f1C233D6e2723Ab'; // Replace with your NFT contract address
  private marketplaceContractAddress = '0xF302c770FE09780068F207E4cb7E0E32a355DB75'; // Replace with your marketplace contract address

  constructor() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.web3 = new Web3((window as any).ethereum);
      this.nftContract = new this.web3.eth.Contract((nftABI as any).abi, this.nftContractAddress);
      this.marketplaceContract = new this.web3.eth.Contract((marketplaceABI as any).abi, this.marketplaceContractAddress);
    } else {
      console.error('MetaMask is not installed!');
    }
  }

  async requestAccount(): Promise<string> {
    try {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await this.web3.eth.getAccounts();
      return accounts[0];
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  }

  async mintNFT(nft: Nft): Promise<number> {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const sender = accounts[0];
      const receipt = await this.nftContract.methods.mintNFT(sender, nft.tokenURI).send({ from: sender, gas: 3000000 });
      const tokenId = receipt.events.Transfer.returnValues.tokenId;
      console.log(`Minted NFT with token ID: ${tokenId}`);
      return tokenId;
    } catch (error) {
      console.error(`Error minting NFT: ${error}`);
      throw error;
    }
  }

  async listNFT(nft: Nft): Promise<void> {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const sender = accounts[0];
      console.log(sender, nft.contractAddress, nft.tokenId, nft.price);
      await this.nftContract.methods.approve(this.marketplaceContractAddress, nft.tokenId).send({ from: sender, gas: 3000000 });
      const receipt = await this.marketplaceContract.methods.listItem(nft.contractAddress, nft.tokenId, this.web3.utils.toWei(nft.price.toString(), 'ether')).send({ from: sender, gas: 3000000 });
      console.log(`NFT listed successfully. Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(`Error listing NFT: ${error}`);
      throw error;
    }
  }

  async buyNFT(nft: Nft): Promise<void> {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const buyer = accounts[0];
      const receipt = await this.marketplaceContract.methods.buyItem(nft.contractAddress, nft.tokenId).send({ from: buyer, value: this.web3.utils.toWei(nft.price.toString(), 'ether'), gas: 3000000 });
      console.log(`NFT bought successfully. Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(`Error buying NFT: ${error}`);
      throw error;
    }
  }

  // New methods to fetch token details
  async getTokenURI(tokenId: number): Promise<string> {
    try {
      const tokenURI = await this.nftContract.methods.tokenURI(tokenId).call();
      return tokenURI;
    } catch (error) {
      console.error(`Error fetching token URI: ${error}`);
      throw error;
    }
  }

  async getTokenOwner(tokenId: number): Promise<string> {
    try {
      const owner = await this.nftContract.methods.ownerOf(tokenId).call();
      return owner;
    } catch (error) {
      console.error(`Error fetching token owner: ${error}`);
      throw error;
    }
  }
}
