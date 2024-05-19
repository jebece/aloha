import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  constructor(private http: HttpClient) {}

  public getAccommodations(){
    return this.http.get(environment.urlHost + '/api/accommodation')
    .pipe(catchError(this.handleError));
  }

  public createAccommodation(accommodationData: any){
    return this.http.post(environment.urlHost + '/api/accommodation/create', accommodationData)
    .pipe(catchError(this.handleError));
  }

  public updateAccommodation(accommodationData: any){
    return this.http.put(environment.urlHost + '/api/accommodation/update', accommodationData)
    .pipe(catchError(this.handleError));
  }

  public deleteAccommodation(id: any): Observable<any> {
    return this.http.delete(`${environment.urlHost}/api/accommodation/delete`, { body: id })
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
