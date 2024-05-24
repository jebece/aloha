import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { UserService } from '../../services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/auth/login.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent implements OnInit {
  payError: string = '';
  payForm = this.formBuilder.group({
    owner: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    cardExpiration: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
    cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
  })

  userLoginOn: boolean = false;
  userData?: User;
  user?: User;
  errorMessage: string = '';
  decodedToken: any;
  clientId?: number;

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private loginService: LoginService, private router: Router) {
    this.userLoginOn = false;
  }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
    if (!this.userLoginOn) {
      this.router.navigate(['login']);
    } else {
      this.userService.getUser().subscribe({
        next: (userData) => {
          this.user = userData;
          if (this.user && this.user.token) {
            this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
          }
          if (this.decodedToken.id) {
            this.clientId = this.decodedToken.id;
          }
        },
        error: (errorData) => {
          this.errorMessage = errorData;
        },
        complete: () => {
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
    }
  }

  get owner() {
    return this.payForm.controls.owner;
  }

  get cardNumber() {
    return this.payForm.controls.cardNumber;
  }

  get cardExpiration() {
    return this.payForm.controls.cardExpiration;
  }

  get cvc() {
    return this.payForm.controls.cvc;
  }
}
