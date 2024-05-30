import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Accommodationunit } from '../../models/accommodationunit';

@Injectable({
  providedIn: 'root',
})
export class CategoryaccommodationunitService {
  private url = 'http://localhost:8080/api/category-accommodation-unit';
  private urlAccommodation = 'http://localhost:8080/api/accommodation-unit';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Accommodationunit[]>(this.urlAccommodation);
  }

  getCategoryAccommodationUnitByLocation(location: string) {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/location/${location}`
    );
  }

  getAccommodationUnitHotel() {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/category/hotels`
    );
  }

  getAccommodationUnitHouse() {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/category/houses`
    );
  }

  getAccommodationUnitHostel() {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/category/hostels`
    );
  }

  getAccommodationUnitBungalow() {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/category/bungalows`
    );
  }

  getAccommodationUnitByCategory(categories: boolean[]) {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/category/${categories}`
    );
  }

  getAccommodationUnitByService(services: boolean[]) {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/service/${services}`
    );
  }

  getAccommodationUnitByAll(
    location: string,
    maxPrice: number,
    services: boolean[],
    categories: boolean[]
  ) {
    return this.http.get<Accommodationunit>(
      `${this.urlAccommodation}/location/${location}/price/${maxPrice}/services/${services}/categories/${categories}`
    );
  }
}
