import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginError:string='';
  loginForm=this.formBuilder.group({
    email:['', [Validators.required, Validators.email]],
    password:['', Validators.required]
  })

  constructor(private formBuilder:FormBuilder, private router:Router, private loginService:LoginService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    
  }

  ngOnInit():void {}

  login() {
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.loginError = "Usuario o contraseña incorrectos";
          this.toastr.error('Error al iniciar sesión', '', {timeOut: 1500});
        },
        complete: () => {
          console.info('Login completo');
          this.router.navigate(['']);
          this.loginForm.reset();
          this.toastr.success('Sesión iniciada con éxito', '', {timeOut: 1500});
        }
      });
    }else{
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
