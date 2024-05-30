import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRequest } from '../../services/auth/registroRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
    password: ['', [Validators.required, Validators.minLength(7)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  })

  constructor(private userService: UserService, private formBuilder:FormBuilder, private router:Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  formSubmit() {
    if(this.registroForm.valid){
      this.userService.addClient(this.registroForm.value as RegistroRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.registroError = "Ya existe un usuario con el email especificado";
          this.toastr.error('', 'Error en el proceso de registro', {timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right'});
        },
        complete: () => {
          console.info('Registro completo');
          this.router.navigate(['']);
          this.registroForm.reset();
          this.toastr.success('', 'Registro completado con éxito', {timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right'});
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

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}
