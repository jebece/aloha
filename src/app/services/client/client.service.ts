import { Injectable } from '@angular/core';
import { updateRequest } from './updateRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable, catchError, throwError} from 'rxjs';
import { deleteRequest } from './deleteRequest';
import { CreateRequest } from './createRequest';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {}

  public updateClient(id: number, userData: any){
    return this.http.put(environment.urlHost + '/api/client/' + id + '/update', userData)
    .pipe(catchError(this.handleError));
  }

  public deleteClient(id: deleteRequest): Observable<any> {
    return this.http.delete(`${environment.urlHost}/api/client/delete`, { body: id })
    .pipe(catchError(this.handleError));
  }

  public getClients(){
    return this.http.get(environment.urlHost + '/api/client')
    .pipe(catchError(this.handleError));
  }

  public createClient(userData: CreateRequest){
    return this.http.post(environment.urlHost + '/api/client/create', userData)
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
