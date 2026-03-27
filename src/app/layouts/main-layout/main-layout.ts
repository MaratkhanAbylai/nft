import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser: string = localStorage.getItem('currentUser') || '';

  constructor(private router: Router) {}

  exit(): void {
    this.currentUser = '';
    localStorage.removeItem('currentUser');
    this.router.navigate(["/"]);
  }
}
