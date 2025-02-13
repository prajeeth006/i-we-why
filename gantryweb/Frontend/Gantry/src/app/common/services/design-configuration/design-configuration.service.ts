import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { DesignConfiguration } from '../../models/design-configuration.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignConfigurationService {
  designConfiguration$ = this.httpService.get<DesignConfiguration>('en/api/getDesignConfiguration').pipe(shareReplay());

  constructor(private httpService: HttpService) {
  }
}
