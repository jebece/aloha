import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userLoginOn: boolean = false;
  userData?: User;
  user?: User;
  decodedToken: any;
  showProfileButton: boolean = false;
  showPanelButton: boolean = false;

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private loginService: LoginService, private userService: UserService) {
    this.userLoginOn = false;
  }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
    if (this.userLoginOn) {
      this.userService.getUser().subscribe({
        next: (userData) => {
          this.user = userData;
          if (this.user && this.user.token) {
            this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
          }
          if (this.decodedToken.role === 'ADMIN') {
            this.showPanelButton = true;
          }
          if (this.decodedToken.role === 'CLIENT') {
            this.showProfileButton = true;
          }
        }
      });
    }
  }

  logout(): void {
    this.loginService.logout();
  }
}
