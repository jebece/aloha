import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryaccommodationunitService {
  private url = 'http://localhost:8080/api/categoryaccommodationunit';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Categoryaccommodationunit[]>(this.url);
  }
}
