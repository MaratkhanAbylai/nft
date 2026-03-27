import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-auth-layout',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

  protected loginValue = "";
  protected passwordValue = "";
  protected mode: string = "login";

  constructor(private router: Router) {}

  changeMode(): void {
    
    if(this.mode === "login") {
      this.mode = "register";
    } else {
      this.mode = "login"
    }

    this.loginValue = '';
    this.passwordValue = '';

  }

  validation(): void {
    if(!(this.loginValue.length > 0) || !(this.passwordValue.length > 0)) {
      alert("Все поля должны быть заполнены");
      throw new Error("Все поля должны быть заполнены");
    }
    if(this.loginValue.length < 3) {
      alert("Логин должен состоять как минимум из 2 символов");
    }
    if(this.passwordValue.length < 8) {
      alert("Пароль должен состоять как минимум из 8 символов");
      throw new Error("Пароль должен быть больше 8 символов");
    }
  }

  login(): void {

    this.validation();
    
    let rawData = localStorage.getItem('users');
    let users = rawData ? JSON.parse(rawData) : [];

    let founded: boolean = false;
    for(let user of users) {
      if(user.login === this.loginValue && user.password === this.passwordValue) {
        this.router.navigate(['']);
        founded = true;
        localStorage.setItem('currentUser', this.loginValue);
      }
    }

    if(!founded) {
      alert('Неверные данные');
    }

  }

  register(): void {

    this.validation();

    let newUser = {
      login: this.loginValue,
      password: this.passwordValue,
      username: ""
    }

    let rawData = localStorage.getItem('users');
    let users = rawData ? JSON.parse(rawData) : [];

    for(let user of users) {
      if(user.login === this.loginValue) {
        alert('Такой логин уже занят');
        throw new Error('Такой логин уже занят');
      }
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Успешная регистрация!');
    this.changeMode();

  }  

}
