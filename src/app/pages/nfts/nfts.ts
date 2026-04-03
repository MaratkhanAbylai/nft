import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

interface INft {
  id: number,
  "created-by": string,
  owner: string,
  likes: number,
  likers: Array<string>,
  avatar: string,
  "nft-picture": string,
  "collection-name": string,
  name: string,
  category: string,
  price: string,
  comments: Array<string>
}

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nfts.html',
  styleUrl: './nfts.css'
})
export class Nfts {

  nfts: Array<any> = [];
  currentUser: string = localStorage.getItem('currentUser')!;

  constructor(private router: Router) {
    let rawData = localStorage.getItem('nfts');
    let nfts = rawData ? JSON.parse(rawData) : [];
    this.nfts = nfts;
  }

  openNft(currentNft: string) {
    if(!localStorage.getItem('currentUser')) {
      alert('Чтобы открыть nft, вам нужно войти в учетную запись');
      throw new Error('Чтобы открыть nft, вам нужно войти в учетную запись');
    }
    localStorage.setItem("currentNft", currentNft);
    this.router.navigate(['art-page']);
  }

  setLike(nft: INft) {
    
    if(this.currentUser) {
      let userIndex: number = nft.likers.indexOf(this.currentUser);

      if(userIndex !== -1) {
        nft.likers.splice(userIndex, 1);
        nft.likes--;
      } else {
        nft.likers.push(this.currentUser);
        nft.likes++;
      }

      localStorage.setItem('nfts', JSON.stringify(this.nfts));
    }

  }

  buy(nft: INft): void {
    if(this.currentUser) {
      nft.owner = this.currentUser;
      localStorage.setItem('nfts', JSON.stringify(this.nfts));
      alert('purchased');
    }
  }

}
