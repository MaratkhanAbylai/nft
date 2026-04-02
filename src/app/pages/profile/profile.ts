import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface IProfile {
  login: string | null,
  username: string | null,
  bio: string | null
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  haveProfile: boolean = false;
  profiles: Array<IProfile> = [];
  profile: IProfile | null = null;
  username: string = '';
  bio: string = '';
  isEditing: boolean = false;

  constructor() {
    let rawData = localStorage.getItem('profiles');
    let profiles = rawData ? JSON.parse(rawData) : [];
    if(profiles.length > 0) {
      this.profiles = profiles;
      for(let profile of profiles) {
        if(profile.login === localStorage.getItem('currentUser')) {
          this.haveProfile = true;
          this.profile = profile;
          this.username = profile.username;
          this.bio = profile.bio;
        }
      }
    }
  }

  validation(): void {
    if(this.username.length > 20) {
      alert('Имя пользователя не может быть больше 20 символов');
      throw new Error('Имя пользователя не может быть больше 20 символов');
    }

    if(!this.username) {
      alert('Поля имени пользователя должна быть заполнена');
      throw new Error('Поля имени пользователя должна быть заполнена');
    }

    for(let word of this.username.split(' ')) {
      if(word[0] !== word[0].toUpperCase() && word[0] === word[0].toLowerCase()) {
        alert('Каждое слово в имени пользователя должна начинаться с заглавной буквы');
        throw new Error('Каждое слово в имени пользователя должна начинаться с заглавной буквы');
      }
    }
  }

  createProfile(): void {

    this.validation();

    let newProfile = {
      login: localStorage.getItem('currentUser'),
      username: this.username,
      bio: this.bio
    }

    this.profile = newProfile;

    this.profiles.push(newProfile);

    this.haveProfile = true;

    localStorage.setItem('profiles', JSON.stringify(this.profiles));
    alert('Профиль создан!');
  }

  edit(): void {    
    this.isEditing = true;
  }

  save(): void {
    this.validation();
    
    this.profiles.forEach(profile => {
      if(profile.login === localStorage.getItem('currentUser')) {
        this.profile!.username = this.username;
        this.profile!.bio = this.bio;
      }
    });

    localStorage.setItem('profiles', JSON.stringify(this.profiles));

    this.isEditing = false;

  }

}
