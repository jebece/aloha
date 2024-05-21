import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
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
    private route: ActivatedRoute,
    private categoryAccommodationUnitService: CategoryaccommodationunitService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;

    // this.route.queryParams.subscribe((params) => {
    //   this.location = params['location'];
    //   this.start = params['start'];
    //   this.end = params['end'];
    //   this.people = +params['people'];
    //   this.houses = params['houses'] === 'true';
    //   this.hotels = params['hotels'] === 'true';
    //   this.hostels = params['hostels'] === 'true';
    //   this.bungalows = params['bungalows'] === 'true';
    // });

    if (
      this.route.snapshot.queryParams['location'] == null ||
      this.route.snapshot.queryParams['location'] == ''
    ) {
      this.categoryAccommodationUnitService.getAll().subscribe((response) => {
        console.log(response);
        console.log(this.route.snapshot.queryParams);
      });
    } else {
      this.categoryAccommodationUnitService
        .getCategoryAccommodationUnitByLocation(
          this.route.snapshot.queryParams['location']
        )
        .subscribe((response) => {
          console.log(response); // Accede al parámetro recibido location, cargado en la página de inicio
        });
    }
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
}
