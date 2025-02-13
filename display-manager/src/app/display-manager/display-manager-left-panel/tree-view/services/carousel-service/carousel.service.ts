import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CarouselComponent } from 'src/app/display-manager/display-manager-left-panel/carousel/carousel.component';
import { Carousel } from 'src/app/display-manager/display-manager-left-panel/carousel/models/carousel';
import { ProfileScreen } from 'src/app/display-manager/display-manager-right-panel/profiles/models/profile';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  isCarouselTabSelectedData = new BehaviorSubject<boolean>(false);
  isCarouselTabSelecte$ = this.isCarouselTabSelectedData.asObservable();

  isCarouselPopupOpenedData = new BehaviorSubject<boolean>(false);
  isCarouselPopupOpened$ = this.isCarouselPopupOpenedData.asObservable();

  addOrEditedCarouselData = new ReplaySubject<Carousel>();
  addOrEditedCarousel$ = this.addOrEditedCarouselData.asObservable();

  dialogRef: MatDialog;

  screenForCarouselData?: ProfileScreen;

  constructor(private _dialogRef: MatDialog) {
    this.dialogRef = _dialogRef;
  }

  setCarouselTabActive(){
    this.isCarouselTabSelectedData.next(true);
  }

  setCarouselTabInActive(){
    this.isCarouselTabSelectedData.next(false);
  }

  setCarouselPopupOpen(){
    this.isCarouselPopupOpenedData.next(true);
  }

  setCarouselPopupClose(carousel?: Carousel){
    !!carousel && this.addOrEditedCarouselData.next(carousel);
    this.isCarouselPopupOpenedData.next(false);
  }

  setScreenForCarousel(screen?: ProfileScreen){
    this.screenForCarouselData = screen;
  }
}
