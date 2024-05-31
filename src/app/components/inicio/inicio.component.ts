import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  errorMessage: string = '';

  location: string = '';
  start?: Date;
  end?: Date;
  people: number = 2;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;

  minDate: string = '';
  minEndDate: string = '';

  constructor(private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
    this.updateMinEndDate(this.minDate);
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
      houses: this.houses,
      hotels: this.hotels,
      hostels: this.hostels,
      bungalows: this.bungalows
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
