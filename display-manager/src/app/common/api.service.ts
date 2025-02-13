import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProgressService } from './progress-service/progress.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private progress: ProgressService) { }

  get<T>(url: string, params?: HttpParams | {}): Observable<T> {
    // this.progress.start();
    return this.httpClient.get<T>(url, { params: params }).pipe(
      map((data) => {
        this.progress.done()
        return data;
      }));
  }

  post<T>(url: string, body: any | undefined, params: HttpParams | undefined = undefined): Observable<T> {
    // this.progress.start();
    return this.httpClient.post<T>(url, body, { params: params }).pipe(
      map((data) => {
        this.progress.done();
        return data
      }),
      catchError((error) => {
        this.progress.done();                
        return throwError(() => error);
      })
    );
  }

  delete<T>(url: string, params?: HttpParams | {}): Observable<T> {
    return this.httpClient.delete<T>(url, { params: params }).pipe(
      map((data) => {
        this.progress.done();
        return data;
      }),
      catchError((error) => {
        this.progress.done();
        return throwError(() => error);
      })
    );
  }

  handleError(error: any) {
    return throwError(error.message)
  }

}
