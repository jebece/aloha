import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environments';
import { RegistroRequest } from '../auth/registroRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    // Obtenemos el token del usuario actualmente autenticado desde la sesión 
    const token = sessionStorage.getItem('token');

    const user: User = {
      token: token || ''
    };

    // Devolvemos los datos del usuario como un observable
    return new Observable<User>(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  public addClient(user: RegistroRequest) {
    return this.http.post(environment.urlHost + '/auth/registerClient', user)
    .pipe(catchError(this.handleError));
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
      () => new Error('Algo falló. Por favor, inténtelo de nuevo más tarde')
    );
  }
}
