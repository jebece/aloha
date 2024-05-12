import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor(private http: HttpClient) { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem('token') != null);
    this.currentUserData = new BehaviorSubject<String>(sessionStorage.getItem('token') || '');
  }

  login(credentials:LoginRequest):Observable<any>{
    return this.http.post<any>(environment.urlHost + "/auth/loginClient", credentials).pipe(
    tap( (userData) => {
      sessionStorage.setItem('token', userData.token);
      this.currentUserLoginOn.next(true);
      this.currentUserData.next(userData.token);
    }),
    map((userData)=> userData.token),
    catchError(this.hadleError)
    );
  }

  logout():void{
    sessionStorage.removeItem('token');
    this.currentUserLoginOn.next(false);
  }

  private hadleError(error: HttpErrorResponse) {
    if(error.status === 0){
      console.error('Se ha producido un error ', error.error);
    }else{
      console.error('Backend retornó el código de estado ', error);
    }

    return throwError(()=> new Error('Algo falló. Por favor, inténtelo de nuevo más tarde.'));
  }

  get userData():Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLogin():Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

}
