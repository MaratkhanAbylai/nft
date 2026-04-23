import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface INft {
  id: number;
  "for-sale": boolean;
  "created-by": string | null;
  owner: string | null;
  likes: number;
  likers: string[];
  avatar: string;
  "nft-picture": string;
  "collection-name": string;
  name: string;
  category: string;
  price: number;
  description: string;
  comments: string[];
}

@Component({
  selector: 'app-create-nft',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-nft.html',
  styleUrl: './create-nft.css',
})
export class CreateNft {
  readonly API_URL = 'http://localhost/backend/upload_nft.php';
  readonly BASE_IMAGE_PATH = 'http://localhost/public/images/nfts/';

  created: boolean = false;
  nftName: string = '';
  selectedCategory: string = '';
  selectedCollectionName: string = '';
  nftPrice: number = 1;
  description: string = '';
  
  pictureURL: string = '';
  selectedFile: File | null = null;
  fileIsSelected: boolean = false;
  loading: boolean = false;
  createdNftImageUrl: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pictureURL = URL.createObjectURL(file);
      this.fileIsSelected = true;
    }
  }

  private validation(): void {
    if (this.nftName.length < 10) {
      alert('Название nft не может быть меньше 10 символов');
      throw new Error('Validation failed');
    }
    if(this.nftName.trim().length > 30) {
      alert('Максимальная длина 15 символов');
      throw new Error('Validation failed');
    }
    if (!this.selectedFile) {
      alert('Выберите изображение для NFT');
      throw new Error('No file selected');
    }
    if (!this.selectedCategory || !this.selectedCollectionName || this.nftPrice <= 0) {
      alert('Заполните все поля корректно');
      throw new Error('Validation failed');
    }
  }

  async createNft(): Promise<void> {
    try {
      this.loading = true;
      this.validation();

      const formData = new FormData();
      formData.append('nft-image', this.selectedFile!);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        const finalImagePath = this.BASE_IMAGE_PATH + result.url;
        this.createdNftImageUrl = finalImagePath;
        const rawData = localStorage.getItem('nfts');
        const nfts: INft[] = rawData ? JSON.parse(rawData) : [];

        if (nfts.find(n => n.name === this.nftName)) {
          alert('Nft с таким названием уже существует');
          return;
        }

        const newId = nfts.length === 0 ? 1 : nfts[nfts.length - 1].id + 1;
        const currentUser = localStorage.getItem('currentUser');
        const finalPrice = this.nftPrice.toFixed(2);

        const newNft: INft = {
          id: newId,
          "for-sale": true,
          "created-by": currentUser,
          owner: currentUser,
          likes: 0,
          likers: [],
          avatar: 'assets/images/avatars/default.jpg', 
          "nft-picture": finalImagePath,
          "collection-name": this.selectedCollectionName,
          name: this.nftName,
          category: this.selectedCategory,
          price: this.nftPrice,
          description: this.description,
          comments: []
        };

        nfts.push(newNft);
        localStorage.setItem('nfts', JSON.stringify(nfts));
        
        this.created = true;
        this.cdr.detectChanges();
      } else {
        alert('Ошибка при загрузке: ' + result.message);
      }
    } catch (e) {
      console.error('Create NFT Error:', e);
    } finally {
      this.loading = false;
    }
  }
}