import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowHelper {

  constructor() {
  }

  raiseEventToElectron = (function() {
    var executed = false;
    return function() {
        if (!executed) {
          //Commenting this as of now we dont need this in RB-1.11
            // if (window['electronAPI']?.pageLoadComplete) {
            //   console.log('Dispatched pageLoadComplete Event');
            //   executed = true;
            //   window['electronAPI'].pageLoadComplete();
            // }
        }
    };
  })();
}
