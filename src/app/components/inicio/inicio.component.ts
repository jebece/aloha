import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  user?: User;
  errorMessage: string = '';

  location: string = '';
  start: Date = new Date();
  end: Date = new Date();
  people: number = 2;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;

  minDate: string = '';
  minEndDate: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private categoryAccommodationUnitService: CategoryaccommodationunitService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;

    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (errorData) => {
        this.errorMessage = errorData;
      },
      complete: () => {
        console.info('Petición completada');
      },
    });
  }

  updateMinEndDate(startDate: string): void {
    if (startDate) {
      const selectedDate = new Date(startDate);
      selectedDate.setDate(selectedDate.getDate() + 1);

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      this.minEndDate = `${year}-${month}-${day}`;
    }
  }

  searchAccommodation(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people,
      houses: this.houses,
      hotels: this.hotels,
      hostels: this.hostels,
      bungalows: this.bungalows,
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }
}
