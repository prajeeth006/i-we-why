import { Injectable } from '@angular/core';
import { ScreenType } from '../models/screen-size.model';

@Injectable({
  providedIn: 'root'
})
export class ScreenTypeService {
  isHalfScreenType = false;
  isFullScreenType=false;
  
  setScreenType(screenType: string) {
    if (screenType === ScreenType.half) {
     this.isHalfScreenType= true;
    }
    else if(screenType === ScreenType.full){
      this.isFullScreenType= true;
    }
  
  }

  constructor() { }
}
