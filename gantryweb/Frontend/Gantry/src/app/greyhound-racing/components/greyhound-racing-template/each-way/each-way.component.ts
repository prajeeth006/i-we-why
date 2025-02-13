import { Component, Input, OnChanges } from '@angular/core';
import { GreyhoundRunner } from 'src/app/greyhound-racing/models/racing-content.model';

@Component({
  selector: 'gn-greyhound-each-way',
  templateUrl: './each-way.component.html',
  styleUrls: ['./each-way.component.scss']
})
export class GreyhoundEachWayComponent implements OnChanges {

  @Input() runnerCount: string;
  @Input() marketEachWayString: string;
  @Input() racingPostTipOrder: Array<string> = [];
  @Input() isEventResulted: boolean;
  @Input() racingPostTipImage: string;
  @Input() nap: string;
  @Input() isNonRunner: boolean;
  @Input() isUKEvent: boolean;
  @Input() hasAnyReservedRunner: boolean;
  @Input() isHalfScreenType: boolean;
  @Input() isFullScreenType: boolean;
  @Input() Footer: string;
  @Input() showPostPic: boolean;
  @Input() showFooter: boolean;
  @Input() isForm: Array<GreyhoundRunner> | null | undefined;
  @Input() ismarketSelectionPresent: boolean;
  @Input() showForm: boolean;
  @Input() areCurrentPricesPresent: boolean;
  @Input() isAdditionalMarket: boolean;
  showRightSideContent: boolean = false;
  constructor() {
  }

  ngOnChanges() {
    if ((this.isFullScreenType && this.isUKEvent && this.showPostPic) || (!this.isHalfScreenType && !this.isFullScreenType)) {
      if (!this.areCurrentPricesPresent && this.isForm && !this.isFullScreenType && !this.isNonRunner && !this.hasAnyReservedRunner) {
        this.showRightSideContent = true;
        return;
      }
      else if (this.areCurrentPricesPresent && !this.isFullScreenType && !this.isNonRunner && !this.hasAnyReservedRunner && this.racingPostTipOrder?.length > 0) {
        this.showRightSideContent = true;
        return;
      }
      else if ((!this.isAdditionalMarket &&this.isFullScreenType) && this.racingPostTipOrder?.length > 0 && !this.showForm && !this.isNonRunner && !this.hasAnyReservedRunner) {
        this.showRightSideContent = true;
        return;
      }
    }

    this.showRightSideContent = false;

  }

}
