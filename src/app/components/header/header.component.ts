import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userLoginOn:boolean = false;
  userData?:User;

  constructor(private loginService:LoginService) {
    this.userLoginOn = false;
  }

  ngOnInit():void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
  }

  logout(): void {
    this.loginService.logout();
  }
}
