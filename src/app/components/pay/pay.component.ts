import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent implements OnInit{
  payError:string='';
  payForm=this.formBuilder.group({
    cardNumber:['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    cardExpiration:['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
    cvc:['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
  })

  constructor(private formBuilder:FormBuilder) {
    
  }

  ngOnInit(): void {
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
