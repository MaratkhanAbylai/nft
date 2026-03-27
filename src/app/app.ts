import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('nft');

  constructor() {
    if(!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    if(!localStorage.getItem('nfts')) {
      localStorage.setItem('nfts', JSON.stringify([]));
    }
    if(!localStorage.getItem('profiles')) {
      localStorage.setItem('profiles', JSON.stringify(null));
    }
  }

}
