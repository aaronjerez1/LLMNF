import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-nft-details',
  templateUrl: './nft-details.component.html',
  styleUrls: ['./nft-details.component.scss']
})
export class NftDetailsComponent implements OnInit {
  tokenId!: number;
  tokenURI!: string;
  tokenOwner!: string;

  form = new FormGroup({
    tokenId: new FormControl(),
  });

  constructor(private web3Service: Web3Service) { }

  async ngOnInit(): Promise<void> {
  }

  async fetchTokenDetails(): Promise<void> {
    try {
      this.tokenURI = await this.web3Service.getTokenURI(this.form.value.tokenId);
      this.tokenOwner = await this.web3Service.getTokenOwner(this.form.value.tokenId);
    } catch (error) {
      console.error('Error fetching token details:', error);
    }
  }

}
