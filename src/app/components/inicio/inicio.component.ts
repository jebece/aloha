import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'] 
})
export class InicioComponent{
  user?: User;
  errorMessage: string = '';
  
  constructor(private router: Router, private userService:UserService) {

    this.userService.getUser().subscribe({
      next: (userData) =>{
        this.user=userData;
      },
      error: (errorData) =>{
        this.errorMessage=errorData;
      },
      complete: () =>{
        console.info('Petición completada');
      }
    })
  }

  location: string = '';
  start: Date = new Date();
  end: Date = new Date();
  people: number = 0;

  searchAccommodation(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people
    };
  
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }
}
