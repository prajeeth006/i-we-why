import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { Market } from 'src/app/snooker/models/snooker.model';

@Component({
  selector: 'gn-match-result',
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.scss']
})
export class MatchResultComponent implements OnInit {

  @Input() market: Market;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [market: string]: SimpleChange }) {

    let marketDetails = change.market.currentValue as Market;
    this.multiMarket.title = marketDetails?.marketDisplayTitle;
    this.multiMarket.marketVersesName = marketDetails?.marketVersesName;
    this.multiMarket.selections = [];
    if (marketDetails?.leftBetList?.length > 0 || marketDetails?.rightBetList?.length > 0)
      Array.from({ length: 1 }).map((x, i) => {
        if (marketDetails?.leftBetList[i] || marketDetails?.rightBetList[i])
          if (!marketDetails?.leftBetList[i]?.hideEntry || !marketDetails?.rightBetList[i]?.hideEntry) {
            this.multiMarket.selections.push({
              homePrice: marketDetails.leftBetList[i]?.betOdds,
              hideHomePrice: marketDetails.leftBetList[i]?.hideOdds,
              homeSelectionTitle: marketDetails.leftBetList[i]?.betName,
              hideHomeTitle: marketDetails.leftBetList[i]?.hideEntry,
              awayPrice: marketDetails.rightBetList[i]?.betOdds,
              hideAwayPrice: marketDetails.rightBetList[i]?.hideOdds,
              awaySelectionTitle: marketDetails.rightBetList[i]?.betName,
              hideAwayTitle: marketDetails.rightBetList[i]?.hideEntry,
            })

          }
      });

  }

  constructor() { }

  ngOnInit(): void {
  }

}
