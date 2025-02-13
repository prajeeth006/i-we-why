import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  hasPageAccessPermission(): Observable<boolean> {
    return this.apiService.get<boolean>('/sitecore/api/displayManager/hasPageAccessPermission/');
  }
}
