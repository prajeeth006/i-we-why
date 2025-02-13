import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterToggleStateService {
  private masterToggleSubject: BehaviorSubject<boolean>;
  currentLabel: string;
  constructor(private apiService: ApiService,
  ) {
    this.masterToggleSubject = new BehaviorSubject<boolean>(true);
  }


  get sequencingToggle$(): Observable<boolean> {
    return this.masterToggleSubject.asObservable();
  }


  setSequencingToggle(value: boolean): void {
    this.masterToggleSubject.next(value);
  }


  getMasterToggle() {
    let params = new HttpParams()
      .append('currentLabel', this.currentLabel)
    this.apiService.get<boolean>('/sitecore/api/displayManager/getMasterToggle', params).subscribe((value: boolean) => {
      this.setSequencingToggle(value);
    });
  }

  saveMasterToggle(toggleValue: boolean) {
    let params = new HttpParams()
      .append('currentLabel', this.currentLabel)
      .append('toggleValue', toggleValue);
    this.apiService.post<any>('/sitecore/api/displayManager/saveMasterToggle', {}, params).subscribe((value: any) => {
      this.setSequencingToggle(toggleValue);
    });
  }

}