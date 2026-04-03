import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface IProfile {
  login: string;
  username: string;
  bio: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  haveProfile: boolean = false;
  profiles: Array<IProfile> = [];
  profile: IProfile | null = null;
  
  username: string = '';
  bio: string = '';
  isEditing: boolean = false;

  avatarUrl: string | null = null;
  currentLogin: string = localStorage.getItem('currentUser') || '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.initData();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppDatabase', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('avatars')) db.createObjectStore('avatars');
        if (!db.objectStoreNames.contains('nfts')) db.createObjectStore('nfts', { keyPath: 'name' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async initData() {
    const rawData = localStorage.getItem('profiles');
    this.profiles = rawData ? JSON.parse(rawData) : [];

    const found = this.profiles.find(p => p.login === this.currentLogin);
    if (found) {
      this.profile = found;
      this.haveProfile = true;
      this.username = found.username;
      this.bio = found.bio;
      await this.loadAvatar(this.currentLogin);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  async saveAvatar(login: string, base64Data: string) {
    const db = await this.openDB();
    const tx = db.transaction('avatars', 'readwrite');
    tx.objectStore('avatars').put(base64Data, login);
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async loadAvatar(login: string) {
    const db = await this.openDB();
    const tx = db.transaction('avatars', 'readonly');
    const store = tx.objectStore('avatars');
    
    const request = store.get(login);
    request.onsuccess = () => {
      if (request.result) {
        this.avatarUrl = request.result;
        this.cdr.detectChanges();
      }
    };
  }

  validation(): void {
    if (!this.username || this.username.length > 20) {
      alert('Имя пользователя некорректно');
      throw new Error('Validation failed');
    }
    this.username.split(' ').forEach(word => {
      if (word && word[0] !== word[0].toUpperCase()) {
        alert('Каждое слово должно быть с заглавной буквы');
        throw new Error('Validation failed');
      }
    });
  }

  async createProfile() {
    this.validation();

    const newProfile: IProfile = {
      login: this.currentLogin,
      username: this.username,
      bio: this.bio
    };

    if (this.avatarUrl) {
      await this.saveAvatar(this.currentLogin, this.avatarUrl);
    }

    this.profiles.push(newProfile);
    localStorage.setItem('profiles', JSON.stringify(this.profiles));
    this.profile = newProfile;
    this.haveProfile = true;
    this.cdr.detectChanges();
  }

  edit() {
    this.isEditing = true;
  }

  async save() {
    this.validation();
    
    this.profiles = this.profiles.map(p => 
      p.login === this.currentLogin ? { ...p, username: this.username, bio: this.bio } : p
    );
    localStorage.setItem('profiles', JSON.stringify(this.profiles));
    
    if (this.avatarUrl) {
      await this.saveAvatar(this.currentLogin, this.avatarUrl);
    }

    this.profile!.username = this.username;
    this.profile!.bio = this.bio;
    this.isEditing = false;
    this.cdr.detectChanges();
  }
}