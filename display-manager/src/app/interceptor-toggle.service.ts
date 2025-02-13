import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './common/api.service';
import { ConfigItem } from './display-manager/display-manager-header/label-selector/label-selector.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorToggleService {
  constructor(private apiService: ApiService) {

  }

  getEnableHttpInterceptor(): Observable<boolean> {
    return this.apiService.get<ConfigItem>('/sitecore/api/displayManager/getGantryConfiguration')
      .pipe(map((configItem: ConfigItem) => configItem.enableHttpInterceptor));
  }
}
