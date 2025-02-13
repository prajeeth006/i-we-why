import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class HostConnectionService {
  constructor(private apiService: ApiService) { }
  
  getKafkaStatus() : Observable<any> {
    return  this.apiService.get<any>('/sitecore/api/displayManager/gantryHealth/HealthGet');
  }
}
