import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userLoginOn: boolean = false;
  userData?: User;
  user?: User;
  decodedToken: any;
  loginError: string = '';
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  })

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService, private spinner: NgxSpinnerService, private toastr: ToastrService, private cookieService: CookieService, private userService: UserService) {

  }

  ngOnInit(): void {
    const email = this.cookieService.get('email');
    const password = this.cookieService.get('password');

    if (email && password) {
      this.loginForm.setValue({ email: email, password: password, rememberMe: true });
    }
  }

  login() {
    if (this.loginForm.valid) {
      const userData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.loginService.login(userData as LoginRequest).subscribe({
        error: (errorData) => {
          console.log(errorData);
          this.loginError = "Usuario o contraseña incorrectos";
          this.toastr.error('', 'Error al iniciar sesión', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
        },
        complete: () => {
          console.info('Login completo');
          if (this.loginForm.value.rememberMe) {
            const email = this.loginForm.value.email ?? '';
            const password = this.loginForm.value.password ?? '';
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);

            this.cookieService.set('email', email, expires);
            this.cookieService.set('password', password, expires);
          }
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
                if (this.decodedToken.role === 'ADMIN') {
                  this.router.navigate(['admin-users']);
                  this.loginForm.reset();
                  this.toastr.success('', 'Sesión iniciada con éxito', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
                }
                if (this.decodedToken.role === 'CLIENT') {
                  this.router.navigate(['']);
                  this.loginForm.reset();
                  this.toastr.success('', 'Sesión iniciada con éxito', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
                }
              },
              error: (errorData) => {
                this.loginError = 'Error al obtener los datos del usuario';
              },
              complete: () => {
                console.info('Petición completada');
              }
            });
      
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

}
