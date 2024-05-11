import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent{
  constructor(private router: Router) {}

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
