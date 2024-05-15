import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit{
  clientError:string='';
  clientForm=this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  })

  constructor(private formBuilder:FormBuilder) {
    
  }

  ngOnInit(): void {
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
    return this.clientForm.controls.password;
  }

}
