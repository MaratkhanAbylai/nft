import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-nfts',
  imports: [FormsModule],
  templateUrl: './my-nfts.html',
  styleUrl: './my-nfts.css',
})
export class MyNfts {

  currentUser: string = localStorage.getItem('currentUser')!;
  myNfts: Array<any> = [];
  nfts: Array<any> = [];
  haveNfts: boolean = false;
  constructor() {
    let login = localStorage.getItem("currentUser");
    let rawData = localStorage.getItem("nfts");
    this.nfts = rawData ? JSON.parse(rawData) : [];
    if(this.nfts.length > 0) {
      for(let nft of this.nfts) {
        if(nft["created-by"] === login) {
          this.haveNfts = true;
          this.myNfts.push(nft);
        }
      }
    }
  }

  setSaleStatus(nft: any) {
    if(nft["for-sale"]) {
      nft["for-sale"] = false;
    } else {
      nft["for-sale"] = true;
    }

    localStorage.setItem('nfts', JSON.stringify(this.nfts))

  }

}
