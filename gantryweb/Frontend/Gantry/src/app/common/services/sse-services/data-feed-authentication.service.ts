import { Injectable } from '@angular/core';
import { DataFeedAuthentication } from '../../models/data-feed-authentication.model';
import { HttpService } from './../http.service';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFeedAuthenticationService {

  dataFeedAuthenticationApi$ = this.httpService.get<DataFeedAuthentication>('en/api/getDataFeedAuthentication').pipe(
    map(data => data),
    shareReplay()
  );

  constructor(private httpService: HttpService) {
  }
}
