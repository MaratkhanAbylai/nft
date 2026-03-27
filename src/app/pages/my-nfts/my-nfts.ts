import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-nfts',
  imports: [FormsModule],
  templateUrl: './my-nfts.html',
  styleUrl: './my-nfts.css',
})
export class MyNfts {

  myNfts: Array<any> = [];
  haveNfts: boolean = false;
  constructor() {
    let login = localStorage.getItem("currentUser");
    let rawData = localStorage.getItem("nfts");
    let nfts = rawData ? JSON.parse(rawData) : [];
    if(nfts.length > 0) {
      this.haveNfts = true;
      for(let nft of nfts) {
        if(nft["created-by"] === login) {
          this.myNfts.push(nft);
        }
      }
    }
  }

}
