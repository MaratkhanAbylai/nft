import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-nfts',
  imports: [FormsModule],
  templateUrl: './my-nfts.html',
  styleUrl: './my-nfts.css',
})
export class MyNfts {

  readonly AVATAR_BASE_URL = 'http://localhost/public/images/';
  readonly API_URL = 'http://localhost/backend/upload_avatar.php';
  currentUser: string = localStorage.getItem('currentUser')!;
  myNfts: Array<any> = [];
  nfts: Array<any> = [];
  avatarUrl: string = '';
  haveNfts: boolean = false;
  constructor(private router: Router) {
    let login = localStorage.getItem("currentUser");
    let rawData = localStorage.getItem("nfts");
    this.nfts = rawData ? JSON.parse(rawData) : [];
    if(this.nfts.length > 0) {
      for(let nft of this.nfts) {
        if(nft["owner"] === login) {
          this.haveNfts = true;
          this.myNfts.push(nft);
        }
      }
    }
  }

  getAuthorAvatar(ownerLogin: string): string {
    let rawProfiles: any = localStorage.getItem('profiles');
    let profiles: any[] = rawProfiles ? JSON.parse(rawProfiles) : [];
    const foundProfile = profiles.find(p => p.login === this.currentUser);
    
    if (foundProfile && foundProfile.avatar_url) {
      return foundProfile.avatar_url.startsWith('http') 
        ? foundProfile.avatar_url 
        : this.AVATAR_BASE_URL + foundProfile.avatar_url;
    }
    
    return 'images/avatars/default.jpg';
  }

  openNft(currentNft: string) {
    if(!localStorage.getItem('currentUser')) {
      alert('Чтобы открыть nft, вам нужно войти в учетную запись');
      throw new Error('Чтобы открыть nft, вам нужно войти в учетную запись');
    }
    localStorage.setItem("currentNft", currentNft);
    this.router.navigate(['art-page']);
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
