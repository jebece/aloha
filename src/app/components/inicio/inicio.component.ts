import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  user?: User;
  errorMessage: string = '';

  location: string = '';
  start?: Date;
  end?: Date;
  people: number = 2;
  categories: boolean[] = [false, false, false, false];

  minDate: string = '';
  minEndDate: string = '';

  constructor(private router: Router, private userService: UserService, private spinner: NgxSpinnerService, private categoryAccommodationUnitService: CategoryaccommodationunitService) { }

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
    this.updateMinEndDate(this.minDate);

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

    if (this.start && this.end) {
      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate.getTime() >= endDate.getTime()) {
        startDate.setDate(endDate.getDate() - 1);
        this.start = startDate;
      }
    }

    const startDate = this.start ? new Date(this.start) : new Date(this.minDate);
    const endDate = this.end ? new Date(this.end) : new Date(this.minEndDate);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const queryParams = {
      location: this.location,
      start: formattedStartDate,
      end: formattedEndDate,
      people: this.people,
      categories: this.categories,
    };
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchAccommodationByLocation(location: string): void {
    const queryParams = {
      location: location,
      start: this.start,
      end: this.end,
      people: this.people,
      categories: this.categories,
    };
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchAccommodationByCategoryHotels(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people,
      categories: [false, true, false, false],
    };
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchAccommodationByCategoryHouses(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people,
      categories: [true, false, false, false],
    };
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchAccommodationByCategoryHostels(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people,
      categories: [false, false, true, false],
    };
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchAccommodationByCategoryBungalows(): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      end: this.end,
      people: this.people,
      categories: [false, false, false, true],
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchCity(city: string): void {
    const queryParams = {
      location: city,
      start: this.minDate,
      end: this.minEndDate,
      people: 2,
      houses: true,
      hotels: true,
      hostels: true,
      bungalows: true
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchCategory(category: string): void {
    let houses = false;
    let hotels = false;
    let hostels = false;
    let bungalows = false;

    if (category === 'houses') { houses = true; }
    if (category === 'hotels') { hotels = true; }
    if (category === 'hostels') { hostels = true; }
    if (category === 'bungalows') { bungalows = true; }

    const queryParams = {
      location: null,
      start: this.minDate,
      end: this.minEndDate,
      people: 2,
      houses: houses,
      hotels: hotels,
      hostels: hostels,
      bungalows: bungalows
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  showSpinner(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
}
