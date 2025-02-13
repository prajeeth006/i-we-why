import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdatesHelperService {

  userSelectedProfile$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isMasterScreensTouched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isProfileDropdownTouched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  resetMasterLayoutTouchedStatus(){
    console.log(`isMasterScreensTouched : false`);
    console.log(`isProfileDropdownTouched : false`);
    this.isMasterScreensTouched$.next(false);
    this.isProfileDropdownTouched$.next(false);
  }

}
