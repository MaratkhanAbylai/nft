import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

interface INft {
  id: number;
  "for-sale": boolean;
  "created-by": string | null;
  owner: string;
  likes: number;
  likers: Array<string>;
  avatar: string;
  "nft-picture": string;
  "collection-name": string;
  name: string;
  category: string;
  price: number;
  comments: Array<string>;
}

interface IProfile {
  login: string;
  avatar_url: string;
}

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nfts.html',
  styleUrl: './nfts.css'
})
export class Nfts implements OnInit {
  readonly AVATAR_BASE_URL = 'http://localhost/public/images/';
  
  nfts: INft[] = [];
  profiles: IProfile[] = [];
  currentUser: string = localStorage.getItem('currentUser') || '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const profilesData = localStorage.getItem('profiles');
    this.profiles = profilesData ? JSON.parse(profilesData) : [];

    const nftData = localStorage.getItem('nfts');
    this.nfts = nftData ? JSON.parse(nftData) : [];
  }

  getAuthorAvatar(ownerLogin: string): string {
    const foundProfile = this.profiles.find(p => p.login === ownerLogin);
    
    if (foundProfile && foundProfile.avatar_url) {
      return foundProfile.avatar_url.startsWith('http') 
        ? foundProfile.avatar_url 
        : this.AVATAR_BASE_URL + foundProfile.avatar_url;
    }
    
    return 'images/avatars/default.jpg';
  }

  openNft(currentNft: string): void {
    if (!this.currentUser) {
      alert('Чтобы открыть nft, вам нужно войти в учетную запись');
      return;
    }
    localStorage.setItem("currentNft", currentNft);
    this.router.navigate(['art-page']);
  }

  setLike(nft: INft): void {
    if (!this.currentUser) return;

    const userIndex = nft.likers.indexOf(this.currentUser);

    if (userIndex !== -1) {
      nft.likers.splice(userIndex, 1);
      nft.likes--;
    } else {
      nft.likers.push(this.currentUser);
      nft.likes++;
    }

    this.saveToStorage();
  }

  buy(nft: INft): void {
    if (!this.currentUser) {
      alert('Войдите в аккаунт для покупки');
      return;
    }
    
    nft.owner = this.currentUser;
    this.saveToStorage();
    alert('NFT успешно куплено!');
  }

  private saveToStorage(): void {
    localStorage.setItem('nfts', JSON.stringify(this.nfts));
  }
}