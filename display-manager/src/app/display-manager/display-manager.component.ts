import { Component, inject, OnInit } from '@angular/core';
import { ProgressService } from '../common/progress-service/progress.service';
import { LabelSelectorService } from './display-manager-header/label-selector/label-selector.service';
import { CarouselService } from './display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { SequencencingHelperService } from './services/sequencencing-helper/sequencencing-helper.service';

@Component({
  selector: 'display-manager',
  templateUrl: './display-manager.component.html',
  styleUrls: ['./display-manager.component.scss']
})
export class DisplayManagerComponent implements OnInit {
  public sequencencingHelper = inject(SequencencingHelperService);
  public labelSelectorService = inject(LabelSelectorService);
  public progressService = inject(ProgressService);
  public carouselService = inject(CarouselService);
  showOverlay: boolean;
  isCarouselModalOpened: boolean;
  isCarouselPopupOpened$ = this.carouselService.isCarouselPopupOpened$;

  constructor() {
    this.updateOverlay();
  }

  ngOnInit(): void {
    this.isCarouselPopupOpened$.subscribe(isCarouselModalOpened => this.isCarouselModalOpened =isCarouselModalOpened);
 
  }

  updateOverlay() {
    this.progressService.progress.subscribe((showProgress:boolean) => {
      //Settimeout is used because of below reason.
      //https://indepth.dev/posts/1001/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error
      setTimeout(()=> {
        this.showOverlay = showProgress;
      }, 0)
    });
  }
}
