import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-art-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './art-page.html',
  styleUrl: './art-page.css',
})
export class ArtPage {
  
  comment: string = '';
  commentate: boolean = false;
  comments: Array<any> = [];
  nfts: Array<any> = [];
  currentNft: string = localStorage.getItem('currentNft')!;
  currentUser: string = localStorage.getItem('currentUser')!;
  collection: string = '';
  category: string = '';
  creator: string = '';
  owner: string = '';
  price: number = 0;

  constructor() {
    let rawData = localStorage.getItem("nfts");
    let nfts = rawData ? JSON.parse(rawData) : [];
    this.nfts = nfts;

    for(let nft of nfts) {
      if(nft.name === this.currentNft) {
        this.comments = nft.comments;
        this.collection = nft["collection-name"];
        this.category = nft.category;
        this.creator = nft["created-by"];
        this.owner = nft.owner;
        this.price = nft.price * 49.99;
      }
    }

  }

  setCommentate() {
    this.commentate = !this.commentate;
  }

  deleteCurrentNft() {
    localStorage.removeItem('currentNft');
  }

  addComment() {
    if(this.comment.replaceAll(' ', '').length === 0) {
      alert("Комментарий должен содержать хотя бы 1 символ");
      throw new Error("Комментарий должен содержать хотя бы 1 символ");
    }
    for(let nft of this.nfts) {
      if(nft.name === this.currentNft) {
        let newComment = {
          "author-avatar": "images/avatars/default.jpg",
          "author": this.currentUser,
          "text": this.comment
        }
        nft.comments.push(newComment);
      }
    }

    localStorage.setItem("nfts", JSON.stringify(this.nfts));

    this.setCommentate();
    this.comment = '';

  }

  buy(): void {
    for(let nft of this.nfts) {
      if(nft.name === this.currentNft) {
        nft.owner = this.currentUser;
      }
    }
    localStorage.setItem('nfts', JSON.stringify(this.nfts));
    alert('Purchased!');
  }

}
