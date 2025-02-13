import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-bothteamsto-score',
  templateUrl: './bothteamsto-score.component.html',
  styleUrls: ['./bothteamsto-score.component.scss']
})
export class BothteamstoScoreComponent implements OnInit {

  @Input() market: Market;
  multiMarket: MultiMarket = new MultiMarket();
  constructor() { }

  ngOnChanges(change: { [market: string]: SimpleChange }) {

    let marketDetails = change.market.currentValue as Market;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.marketDisplayTitle;
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


  }

  ngOnInit(): void {
  }

}
