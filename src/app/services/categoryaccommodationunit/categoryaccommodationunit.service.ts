import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoryaccommodationunit } from '../../models/categoryaccommodationunit';
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
}
