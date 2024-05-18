import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { updateRequest } from '../../services/client/updateRequest';
import { ClientService } from '../../services/client/client.service';
import { Router } from '@angular/router';
import { deleteRequest } from '../../services/client/deleteRequest';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientError: string = '';
  clientForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  });
  confirmError: string = '';
  confirmForm = this.formBuilder.group({
    password: ['', Validators.required]
  });

  user?: User;
  errorMessage: string = '';
  decodedToken: any;
  clientId?: number;
  clientPassword?: string;

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private formBuilder: FormBuilder, private userService: UserService, private clientService: ClientService, private router:Router, private loginService:LoginService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        if (this.user && this.user.token) {
          this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
        }
        if (this.decodedToken.name) {
          this.clientForm.get('name')?.setValue(this.decodedToken.name);
        }
        if (this.decodedToken.surname) {
          this.clientForm.get('surname')?.setValue(this.decodedToken.surname);
        }
        if (this.decodedToken.email) {
          this.clientForm.get('email')?.setValue(this.decodedToken.email);
        }
        if (this.decodedToken.phone) {
          this.clientForm.get('phone')?.setValue(this.decodedToken.phone);
        }
        if (this.decodedToken.id) {
          this.clientId = this.decodedToken.id;
        }
      },
      error: (errorData) => {
        this.errorMessage = errorData;
      },
      complete: () => {
        console.info('Petición completada');
      }
    });
  }

  formSubmit() {
    if (this.clientId !== undefined) {
      if (this.confirmForm.valid) {
        const loginData: LoginRequest = {
          email: this.decodedToken.email ?? '',
          password: this.confirmForm.get('password')?.value ?? ''
        };
  
        this.loginService.login(loginData as LoginRequest).pipe(
          switchMap(() => {
            const updateData: updateRequest = {
              name: this.clientForm.get('name')?.value ?? '',
              surname: this.clientForm.get('surname')?.value ?? '',
              email: this.clientForm.get('email')?.value ?? '',
              phone: this.clientForm.get('phone')?.value ?? '',
              password: this.confirmForm.get('password')?.value ?? ''
            };
  
            return this.clientService.updateClient(this.clientId!, updateData as updateRequest);
          })
        ).subscribe({
          next: (userData) => {
            console.log(userData);
          },
          error: (errorData) => {
            console.log(errorData);
            this.clientError = errorData;
          },
          complete: () => {
            console.info('Registro completo');
            this.router.navigate(['client']);
            this.clientForm.reset();
          }
        });
      } else {
        console.error('El formulario de confirmación no es válido');
      }
    } else {
      console.error('clientId es undefined');
    }
  }

  deleteClient() {
    if (this.clientId !== undefined) {
      const deleteData: deleteRequest = {
        id: this.clientId
      };

      this.clientService.deleteClient(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.clientError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.logout();
          this.router.navigate(['']);
          this.clientForm.reset();
        }
      });
    } else {
      console.error('clientId es undefined');
    }
  }

  get name() {
    return this.clientForm.controls.name;
  }

  get surname() {
    return this.clientForm.controls.surname;
  }

  get phone() {
    return this.clientForm.controls.phone;
  }

  get email() {
    return this.clientForm.controls.email;
  }

  get password() {
    return this.confirmForm.controls.password;
  }

  login() {
    if(this.confirmForm.valid){
      const loginData: LoginRequest = {
        email: this.decodedToken.email ?? '',
        password: this.confirmForm.get('password')?.value ?? ''
      };

      this.loginService.login(loginData as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.confirmError = errorData;
        },
        complete: () => {
          console.info('Login completo');
          this.confirmForm.reset();
        }
      });
    }else{

    }
  }

  logout(): void {
    this.loginService.logout();
  }
}
