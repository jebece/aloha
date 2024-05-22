import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  data: any;
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

    if (
      this.route.snapshot.queryParams['location'] == null ||
      (this.route.snapshot.queryParams['location'] == '' &&
        this.route.snapshot.queryParams['categories'].every(
          (element: string) => element == 'false'
        ))
    ) {
      this.categoryAccommodationUnitService.getAll().subscribe((response) => {
        this.data = response;
      });
    } else if (
      this.route.snapshot.queryParams['location'] == null ||
      (this.route.snapshot.queryParams['location'] == '' &&
        this.route.snapshot.queryParams['categories'].some(
          (element: string) => element == 'true'
        ))
    ) {
      const array = this.route.snapshot.queryParams['categories'].join(',');
      this.categoryAccommodationUnitService
        .getAccommodationUnitByCategory(array)
        .subscribe((response) => {
          this.data = response;
        });
    } else {
      this.categoryAccommodationUnitService
        .getCategoryAccommodationUnitByLocation(
          this.route.snapshot.queryParams['location']
        )
        .subscribe((response) => {
          this.data = response;
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
