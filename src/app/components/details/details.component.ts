import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  location: string = '';
  start: Date = new Date();
  end: Date = new Date();
  people: number = 2;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;
  maxPrice: number = 300;

  minDate: string = '';
  minEndDate: string = '';
  
  constructor(private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  
    this.route.queryParams.subscribe(params => {
      this.location = params['location'];
      this.start = params['start'];
      this.end = params['end'];
      this.people = +params['people'];
      this.houses = params['houses'] === 'true';
      this.hotels = params['hotels'] === 'true';
      this.hostels = params['hostels'] === 'true';
      this.bungalows = params['bungalows'] === 'true';
      this.maxPrice = +params['maxPrice'] || 300;
    });

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
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
      maxPrice: this.maxPrice
    };
  
    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }
}
