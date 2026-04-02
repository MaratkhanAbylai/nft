import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-nft',
  imports: [FormsModule],
  templateUrl: './create-nft.html',
  styleUrl: './create-nft.css',
})
export class CreateNft {

  created: boolean = false;
  forPrintName: string = ''
  nftName: string = '';
  selectedCategory: string = '';
  selectedCollectionName: string = '';
  nftPrice: number = 1;
  description: string = '';

  validation(): void {
    if(this.nftName.length < 10) {
      alert('Название nft не может быть меньше 10 символов');
      throw new Error('Название nft не может быть меньше 10 символов');
    }
    if(!this.selectedCategory) {
      alert('Пожалуйста выберите категорию');
      throw new Error('Пожалуйста выберите категорию');
    }
    if(!this.selectedCollectionName) {
      alert('Пожалуйста выберите тип nft');
      throw new Error('Пожалуйста выберите тип nft');
    }
    if(this.nftPrice <= 0) {
      alert('Цена nft должна быть больше нуля');
      throw new Error('Цена nft должна быть больше нуля');
    }
    if(this.description.length < 10) {
      alert('Описание nft не может быть меньше 10 символов');
      throw new Error('Описание nft не может быть меньше 10 символов');
    }
  }

  createNft(): void {

    this.validation();

    let rawData = localStorage.getItem('nfts');
    let nfts = rawData ? JSON.parse(rawData) : [];

    for(let nft of nfts) {
      if(nft.name === this.nftName) {
        alert('Nft с таким названием уже существует');
        throw new Error('Nft с таким названием уже существует');
      }
    }

    let id: number = 0;
    if(nfts.length === 0) {
      id = 1;
    } else {
      id = nfts[nfts.length - 1].id + 1;
    }

    let newNft = {
      id: id,
      "for-sale": true,
      "created-by": localStorage.getItem("currentUser"),
      likes: 0,
      likers: [],
      avatar: 'images/avatars/default.jpg',
      "nft-picture": 'images/nfts/monkey.png',
      "collection-name": this.selectedCollectionName,
      name: this.nftName,
      category: this.selectedCategory,
      price: this.nftPrice,
      comments: []
    }

    nfts.push(newNft);
    localStorage.setItem('nfts', JSON.stringify(nfts));
    this.created = true;

  }

}
