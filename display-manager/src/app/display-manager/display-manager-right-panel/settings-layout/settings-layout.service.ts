import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { HttpParams } from '@angular/common/http';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsLayoutService {
  private screenSettingTypeSubject: BehaviorSubject<string>;
  currentLabel: string;
  constructor(private apiService: ApiService,
  ) {
    this.screenSettingTypeSubject = new BehaviorSubject<string>('');
  }

  get screenSettingType$(): Observable<string> {
    return this.screenSettingTypeSubject.asObservable();
  }

  setScreenSettingType(value: string): void {
    this.screenSettingTypeSubject.next(value);
  }

  getscreenSettingType() {
    let params = new HttpParams()
      .append('currentLabel', this.currentLabel)
    this.apiService.get<string>('/sitecore/api/displayManager/getScreenSettingType', params).subscribe((value: string) => {
      this.setScreenSettingType(value);
    });
  }

  savescreenSettingType(oldTypeValue: string, typeValue: string) {
    let params = new HttpParams()
      .append('currentLabel', this.currentLabel)
      .append('screenSettingValue', typeValue);
    this.apiService.post<any>('/sitecore/api/displayManager/saveScreenSettingType', {}, params)
      .subscribe((value: string) => {
          value ? this.setScreenSettingType(oldTypeValue) : this.setScreenSettingType(typeValue);
      },
        (error) => {
          // This block is called when an error occurs
          console.error('Error occurred:', error);
          // Handle the error here (e.g., show an error message, log the error, etc.)
          // Optionally, you can set some default behavior for failure, e.g., reset the setting value
          this.setScreenSettingType(oldTypeValue); // Fallback to typeValue in case of error
          // Or you could show a user-friendly error message to the UI
        });
  }

}