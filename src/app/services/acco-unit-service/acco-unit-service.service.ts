import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccoUnitServiceService {

  constructor(private http: HttpClient) {}

  public getAccoUnitServices(){
    return this.http.get(environment.urlHost + '/api/accommodation-unit-service')
    .pipe(catchError(this.handleError));
  }

  public getAccoUnitServicesByAccoUnitId(id:any){
    return this.http.get(environment.urlHost + '/api/accommodation-unit-service/accommodation-unit/' + id)
    .pipe(catchError(this.handleError));
  }

  public createAccoUnitService(accoUnitServiceData: any){
    return this.http.post(environment.urlHost + '/api/accommodation-unit-service/create', accoUnitServiceData)
    .pipe(catchError(this.handleError));
  }

  public editAccoUnitService(accoUnitServiceData: any){
    return this.http.put(environment.urlHost + '/api/accommodation-unit-service/update', accoUnitServiceData)
    .pipe(catchError(this.handleError));
  }

  public deleteAccoUnitService(accoUnitServiceData:any){
    return this.http.delete(environment.urlHost + '/api/accommodation-unit-service/delete', accoUnitServiceData)
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
