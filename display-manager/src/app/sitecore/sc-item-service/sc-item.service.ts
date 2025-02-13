import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ScItemService {

  constructor(private httpClient: HttpClient) { }

  getDataFromMasterDB<T>(apiUrl: string, params?: HttpParams): Observable<T> {
    params = this.getDatabaseQueryParam('master', params);

    return this.httpClient.get<T>(apiUrl, { params: params });
  }

  private getDatabaseQueryParam(database: string, params?: HttpParams): HttpParams {
    if (params) {
      params = params.append('database', database);
    }
    else {
      params = new HttpParams().append('database', database);
    }
    return params;
  }

  getDataFromMasterForManualDB<T>(apiUrl: string, params?: HttpParams): Observable<T> {
    params = new HttpParams().append('database', 'master').append('fields',Constants?.field_for_manual_children).append('includeStandardTemplateFields', 'true');
    return this.httpClient.get<T>(apiUrl, { params: params });
  }
}
