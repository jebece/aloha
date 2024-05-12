import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit {
  public user = {
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  formSubmit() {
    console.log(this.user);
    if (this.user.email == '' || this.user.email == null) {
      console.log('Faltan datos');
      return;
    }

    this.userService.addClient(this.user).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
