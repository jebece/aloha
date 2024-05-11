import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) {}

  getUser(id:number):Observable<User> {
    return this.http.get<User>(environment.urlApi + 'users/' + id).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error:HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error)
    }else{
      console.error('Backend retornó el código de estado ', error.status, error.error)
    }

    return throwError(()=> new Error('Algo falló. Por favor, inténtelo de nuevo más tarde.'));
  }
}
