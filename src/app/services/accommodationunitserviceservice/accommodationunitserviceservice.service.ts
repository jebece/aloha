import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccommodationunitserviceserviceService {
  constructor(private http: HttpClient) {}

  getAccommodationUnitServiceByNameService(nameService: string) {
    return this.http.get<any>(`${environment.urlHost}/api/accommodation-unit-service/nameService/${nameService}`);
  }
}
