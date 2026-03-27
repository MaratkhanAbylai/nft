import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nfts.html',
  styleUrl: './nfts.css'
})
export class Nfts {

  nfts: Array<any> = [];
  clicked: boolean = false;

  constructor() {
    let rawData = localStorage.getItem('nfts');
    let nfts = rawData ? JSON.parse(rawData) : [];
    this.nfts = nfts;
  }

  openNft() {
    this.clicked = true;
  }

  setCurrentNft(currentNft: string) {
    localStorage.setItem("currentNft", currentNft);
  }

}
