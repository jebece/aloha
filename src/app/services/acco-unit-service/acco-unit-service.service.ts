import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccoUnitServiceService {

  constructor(private http: HttpClient) {}

  public createAccoUnitService(accoUnitServiceData: any){
    return this.http.post(environment.urlHost + '/api/accommodation-unit-service/create', accoUnitServiceData)
    .pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error(
        'El backend retornó el código de estado ',
        error.status,
        error.error
      );
    }

    return throwError(
      () => new Error('Algo falló. Por favor, inténtelo de nuevo más tarde')
    );
  }
}
