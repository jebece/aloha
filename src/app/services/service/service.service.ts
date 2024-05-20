import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {}

  public getServices(){
    return this.http.get(environment.urlHost + '/api/service')
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
