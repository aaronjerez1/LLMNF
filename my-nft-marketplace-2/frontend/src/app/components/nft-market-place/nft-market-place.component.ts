import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from 'src/app/services/web3.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nft-market-place',
  templateUrl: './nft-market-place.component.html',
  styleUrls: ['./nft-market-place.component.scss']
})
export class NftMarketPlaceComponent implements OnInit {

  senderAddress!: string;
  nftContractAddress = '0xA32943F9d288b0C1bC72F2923f1C233D6e2723Ab'; // Replace with your NFT contract address
  tokenId!: number;
  price!: number;
  recipientAddress!: string;
  inferredTokenURI: string = '';

  form = new FormGroup({
    price: new FormControl(),
    tokenId: new FormControl(),
    tokenURI: new FormControl(),
    contractAddress: new FormControl(),
    maxTokens: new FormControl(),
    prompt: new FormControl()
  });

  constructor(private web3Service: Web3Service, private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    try {
      this.senderAddress = await this.web3Service.requestAccount();
    } catch (error) {
      console.error('Could not connect to MetaMask:', error);
    }
  }

  async mintAndListNFT(): Promise<void> {
    try {
      // Mint the NFT
      const tokenId = await this.web3Service.mintNFT(this.form.getRawValue());

      // List the NFT
      await this.web3Service.listNFT(this.form.getRawValue());
    } catch (error) {
      console.error('Error minting and listing NFT:', error);
    }
  }

  async inferMintAndListNFT(): Promise<void> {
    try {
      const response: any = await this.http.post('http://104.177.184.13:8080/generate', {
        inputs: this.form.value.prompt,
        parameters: { max_new_tokens: this.form.value.maxTokens }
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).toPromise();

      this.inferredTokenURI = response.generated_text;
      this.form.patchValue({ tokenURI: this.inferredTokenURI }); // Update the form with the inferred token URI
    } catch (error) {
      console.error('Error inferring, minting, and listing NFT:', error);
    }
  }

  async buyNFT(): Promise<void> {
    try {
      await this.web3Service.buyNFT(this.form.getRawValue());
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  }
}
