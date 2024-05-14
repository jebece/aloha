import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRequest } from '../../services/auth/registroRequest';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit {
  registroError:string='';
  registroForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  })

  constructor(private userService: UserService, private formBuilder:FormBuilder, private router:Router) {}

  ngOnInit(): void {}

  formSubmit() {
    if(this.registroForm.valid){
      this.userService.addClient(this.registroForm.value as RegistroRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.registroError = errorData;
        },
        complete: () => {
          console.info('Registro completo');
          this.router.navigate(['']);
          this.registroForm.reset();
        }
    });
    }else{
      this.registroForm.markAllAsTouched();
    }
  }

  get name() {
    return this.registroForm.controls.name;
  }

  get surname() {
    return this.registroForm.controls.surname;
  }

  get phone() {
    return this.registroForm.controls.phone;
  }

  get email() {
    return this.registroForm.controls.email;
  }

  get password() {
    return this.registroForm.controls.password;
  }
}
