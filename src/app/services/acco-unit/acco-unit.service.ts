import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccoUnitService {

  constructor(private http: HttpClient) {}

  public getAccoUnits(){
    return this.http.get(environment.urlHost + '/api/accommodation-unit')
    .pipe(catchError(this.handleError));
  }

  getAccoUnitById(id: number) {
    return this.http.get(environment.urlHost + '/api/accommodation-unit/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  public createAccoUnit(accoUnitData: any){
    return this.http.post(environment.urlHost + '/api/accommodation-unit/create', accoUnitData)
    .pipe(catchError(this.handleError));
  }

  public updateAccoUnit(accoUnitData: any){
    return this.http.put(environment.urlHost + '/api/accommodation-unit/update', accoUnitData)
    .pipe(catchError(this.handleError));
  }

  public deleteAccoUnit(id: any): Observable<any> {
    return this.http.delete(`${environment.urlHost}/api/accommodation-unit/delete`, { body: id })
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
