import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environments';
import { LoginRequest } from '../auth/loginRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(credentials: LoginRequest): Observable<User> {
    return this.http
      .post<User>(environment.urlApi, credentials)
      .pipe(catchError(this.handleError));
  }

  public addClient(user: any) {
    return this.http.post(environment.urlHost + '/auth/registerClient', user);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error(
        'Backend retornó el código de estado ',
        error.status,
        error.error
      );
    }

    return throwError(
      () => new Error('Algo falló. Por favor, inténtelo de nuevo más tarde.')
    );
  }
}
