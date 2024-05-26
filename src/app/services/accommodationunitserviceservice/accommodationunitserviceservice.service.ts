import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccommodationunitserviceserviceService {
  private url = 'http://localhost:8080/api/accommodation-unit-service';

  constructor(private http: HttpClient) {}

  getAccommodationUnitServiceByNameService(nameService: string) {
    return this.http.get<any>(`${this.url}/nameService/${nameService}`);
  }
}
