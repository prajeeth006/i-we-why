import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  get<T>(url: string, params?: HttpParams | {}): Observable<T> {
    return this.httpClient.get<T>(url, { params: params }).pipe(retry({ count: Infinity, delay: 30000 }));
  }

  post<T>(url: string, body: any | undefined, params: HttpParams | undefined = undefined): Observable<T> {
    return this.httpClient.post<T>(url, body, { params: params }).pipe(retry({ count: Infinity, delay: 30000 }));
  }
}
