import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface IProfile {
  login: string;
  username: string;
  bio: string;
  avatar_url: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  readonly AVATAR_BASE_URL = 'http://localhost/public/images/';
  readonly API_URL = 'http://localhost/backend/upload_avatar.php';

  haveProfile: boolean = false;
  profile: IProfile | null = null;
  
  username: string = '';
  bio: string = '';
  isEditing: boolean = false;
  avatarUrl: string | null = null;
  selectedFile: File | null = null;
  currentLogin: string = localStorage.getItem('currentUser') || '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    const rawData = localStorage.getItem('profiles');
    const profiles: IProfile[] = rawData ? JSON.parse(rawData) : [];
    const found = profiles.find(p => p.login === this.currentLogin);

    if (found) {
      this.profile = found;
      this.haveProfile = true;
      this.username = found.username;
      this.bio = found.bio;
      this.avatarUrl = found.avatar_url ? this.AVATAR_BASE_URL + found.avatar_url : "images/avatars/default.jpg";
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    
      this.avatarUrl = URL.createObjectURL(file);

      this.cdr.detectChanges();
    }
  }

  async uploadProcess(): Promise<string> {
    if (!this.selectedFile) return this.profile?.avatar_url || '';

    const formData = new FormData();
    formData.append('avatar', this.selectedFile);
    formData.append('login', this.currentLogin);

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const res = await response.json();
      return res.url; 
    } catch (e) {
      console.error("Fetch error", e);
      return this.profile?.avatar_url || '';
    }
  }

  async createProfile() {
    this.validation();
    const fileName = await this.uploadProcess();

    const newProfile: IProfile = {
      login: this.currentLogin,
      username: this.username,
      bio: this.bio,
      avatar_url: fileName
    };

    this.saveToLocal(newProfile);
    this.profile = newProfile;
    this.haveProfile = true;
    this.avatarUrl = this.AVATAR_BASE_URL + fileName;
    this.cdr.detectChanges();
  }

  async save() {
    this.validation();
    const fileName = await this.uploadProcess();
    
    const updatedProfile: IProfile = {
      login: this.currentLogin,
      username: this.username,
      bio: this.bio,
      avatar_url: fileName
    };

    this.saveToLocal(updatedProfile);
    this.profile = updatedProfile;
    this.avatarUrl = this.AVATAR_BASE_URL + fileName;
    this.isEditing = false;
    this.cdr.detectChanges();
  }

  private saveToLocal(profile: IProfile) {
    const rawData = localStorage.getItem('profiles');
    let profiles: IProfile[] = rawData ? JSON.parse(rawData) : [];
    const index = profiles.findIndex(p => p.login === profile.login);
    
    if (index > -1) profiles[index] = profile;
    else profiles.push(profile);
    
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }

  edit() { this.isEditing = true; }

  validation(): void {
    if (!this.username || this.username.length > 20) {
      alert('Username is incorrect');
      throw new Error('Validation failed');
    }
  }
}