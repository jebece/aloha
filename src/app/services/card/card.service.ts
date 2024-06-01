import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) {}

  public getCards(){
    return this.http.get(environment.urlHost + '/api/card')
    .pipe(catchError(this.handleError));
  }

  public createCard(cardData: any){
    return this.http.post(environment.urlHost + '/api/card/create', cardData)
    .pipe(catchError(this.handleError));
  }

  public existCard(cardData: any) {
    return this.http.post(environment.urlHost + '/api/card/exist', cardData)
      .pipe(catchError(this.handleError));
  }

  public getCardsByClientId(clientId: any) {
    return this.http.get(environment.urlHost + '/api/card/idUsuario/' + clientId)
      .pipe(catchError(this.handleError));
  }

  public deleteCard(cardData: any) {
    return this.http.delete(`${environment.urlHost}/api/card/delete`, { body: cardData })
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
