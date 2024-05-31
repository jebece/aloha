import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginError: string = '';
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  })

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService, private spinner: NgxSpinnerService, private toastr: ToastrService, private cookieService: CookieService) {

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
        next: (userData) => {
          console.log(userData);
        },
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

          this.router.navigate(['']);
          this.loginForm.reset();
          this.toastr.success('', 'Sesión iniciada con éxito', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
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
