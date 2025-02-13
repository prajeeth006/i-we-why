import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-handicap-betting',
  templateUrl: './handicap-betting.component.html',
  styleUrls: ['./handicap-betting.component.scss']
})
export class HandicapBettingComponent implements OnInit {

  @Input() market: Market;
  @Input() isRugbyPage: boolean = false;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [market: string]: SimpleChange }) {

    let marketDetails = change?.market?.currentValue as Market;
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketDisplayTitle;
      this.multiMarket.selections = [];
      this.multiMarket.trimValue = !marketDetails?.isHandicapValue;

      if (marketDetails?.leftBetList?.length > 0 || marketDetails?.rightBetList?.length > 0)
        Array.from({ length: 1 }).map((x, i) => {
          if (marketDetails?.rightBetList[i] || marketDetails?.leftBetList[i])
            if (!marketDetails?.rightBetList[i]?.hideEntry || !marketDetails?.leftBetList[i]?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: marketDetails.rightBetList[i]?.betOdds,
                hideHomePrice: marketDetails.rightBetList[i]?.hideOdds,
                homeSelectionTitle: marketDetails.rightBetList[i]?.betName,
                hideHomeTitle: marketDetails.rightBetList[i]?.hideEntry,
                awayPrice: marketDetails.leftBetList[i]?.betOdds,
                hideAwayPrice: marketDetails.leftBetList[i]?.hideOdds,
                awaySelectionTitle: marketDetails.leftBetList[i]?.betName,
                hideAwayTitle: marketDetails.leftBetList[i]?.hideEntry,
              })
            }

        });
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
