import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccoUnitService } from '../../services/acco-unit/acco-unit.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  accoUnit: any = [];
  location: string = '';
  start?: Date;
  bookStart?: Date;
  end?: Date;
  bookEnd?: Date;
  people: number = 2;
  bookPeople?: number;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;
  maxPrice: number = 300;
  id: number = 0;

  minDate: string = '';
  minEndDate: string = '';

  description: string[] | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private accoUnitService: AccoUnitService
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
    this.updateMinEndDate(this.minDate);

    this.route.queryParams.subscribe(params => {
      this.location = params['location'];
      this.start = params['start'];
      this.bookStart = params['bookStart'];
      this.end = params['end'];
      this.bookEnd = params['bookEnd'];
      this.people = +params['people'];
      this.bookPeople = +params['bookPeople'];
      this.houses = params['houses'] === 'true';
      this.hotels = params['hotels'] === 'true';
      this.hostels = params['hostels'] === 'true';
      this.bungalows = params['bungalows'] === 'true';
      this.maxPrice = +params['maxPrice'] || 300;
      this.id = +params['id'];
    });

    this.accoUnitService.getAccoUnitById(this.id).subscribe(
      (data) => {
        this.accoUnit = data;
        console.log('Unidad de alojamiento obtenida', this.accoUnit);
      },
      (error) => {
        console.error('Error al obtener la unidad de alojamiento', error);
      }
    );

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
      bungalows: this.bungalows,
      maxPrice: this.maxPrice
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  goToPay() {
    const queryParams = {
      bookStart: this.bookStart,
      bookEnd: this.bookEnd,
      bookPeople: this.bookPeople,
      id: this.id
    };

    this.router.navigate(['/pay'], { queryParams: queryParams });
  }

  diferenciaEnDias(): number {
    const fechaInicio = this.bookStart ? new Date(this.bookStart) : null;
    const fechaFin = this.bookEnd ? new Date(this.bookEnd) : null;

    if (fechaInicio && !isNaN(fechaInicio.getTime())) {
      fechaInicio.setHours(0, 0, 0, 0);
    }
    if (fechaFin && !isNaN(fechaFin.getTime())) {
      fechaFin.setHours(0, 0, 0, 0);
    }

    const unDia = 1000 * 60 * 60 * 24; // Milisegundos en un día
    const diferenciaEnMs = fechaFin && fechaInicio ? Math.abs(fechaFin.getTime() - fechaInicio.getTime()) : 0;

    return Math.round(diferenciaEnMs / unDia);
  }
}
