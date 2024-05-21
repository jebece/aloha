import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/auth/login.service';
import { User } from '../../../services/auth/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  userLoginOn:boolean = false;
  userData?:User;

  constructor(private loginService:LoginService, private router:Router) {                      
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
    this.router.navigate(['']);
  }
}
