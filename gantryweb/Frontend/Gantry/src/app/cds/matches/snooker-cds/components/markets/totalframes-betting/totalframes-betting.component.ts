import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { SnookerCdsTemplateResult } from '../../../models/snooker-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-totalframes-betting',
  templateUrl: './totalframes-betting.component.html',
  styleUrls: ['./totalframes-betting.component.scss']
})
export class TotalframesBettingComponent implements OnInit{
  constructor() { }

  @Input() matchData: SnookerCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.TotalFrames;
    this.multiMarket.selections = [];

    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isTotalFrames === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isTotalFrames) {
            this.multiMarket.selections.push({
              homePrice: selection?.totalFrames?.awayPrice,
              homeSelectionTitle: selection?.totalFrames?.awayPlayer,
              awayPrice: selection?.totalFrames?.homePrice,
              awaySelectionTitle: selection?.totalFrames?.homePlayer
            })
          }
        });
      }

    }
  }

  ngOnInit(): void {
  }
}
