import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { CarouselComponent } from 'src/app/display-manager/display-manager-left-panel/carousel/carousel.component';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';
import { LabelSelectorService } from '../label-selector/label-selector.service';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';

@Component({
  selector: 'plus-new',
  templateUrl: './plus-new.component.html',
  styleUrls: ['./plus-new.component.scss']
})
export class PlusNewComponent implements OnInit {

  tabNamesEnum = Constants;
  isMenuOpened: boolean = false;
  activeLabelClass: string;

  constructor(public carouselService: CarouselService,
    public dialog: MatDialog,
    public rightPanelTabControlService: RightPanelTabControlService,
    public labelSelectorService: LabelSelectorService,
    public sequencencingHelper: SequencencingHelperService) { }


  ngOnInit(): void {
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.activeLabelClass = 'in-' + currentLabel?.toLowerCase();
    });

  }

  newCarousel() {
    this.carouselService.setScreenForCarousel(undefined);
    this.carouselService.setCarouselPopupClose();
    this.carouselService.dialogRef.closeAll();
    //Giving timeout to wait for close before one.
    var timeout = setTimeout(() => {
      this.dialog.open(CarouselComponent, {
        id: 'create-new-carousel',
        width: '820px',
        height: '820px',
        backdropClass: 'scope-to-right-pannel',
      });

      this.carouselService.setCarouselPopupOpen();
      clearTimeout(timeout);
    }, 100);
  }

  newSportsCoupon() {
    this.rightPanelTabControlService.onNewSportclick(this.tabNamesEnum.sports);
  }

  newRacingChallenge() {
    this.rightPanelTabControlService.onNewSportclick(this.tabNamesEnum.racing);
  }

  isOpened() {
    this.isMenuOpened = true;
  }

  isClosed() {
    this.isMenuOpened = false;
  }

  newManualRacingTemplate() {
    this.rightPanelTabControlService.onNewSportclick(this.tabNamesEnum.manual);
  }

  newManualSportsTemplate(menuName: string) {
    this.rightPanelTabControlService.onNewSportclick(menuName);
  }
  
}
