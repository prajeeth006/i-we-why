import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BetDetails, Market } from 'src/app/snooker/models/snooker.model';

@Component({
  selector: 'gn-market-results',
  templateUrl: './market-results.component.html',
  styleUrls: ['./market-results.component.scss']
})
export class MarketResultsComponent implements OnInit {

  @Input() market: Market;
  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  multiMarket: MultiMarket = new MultiMarket();
  scoreList: Array<string> = [];

  ngOnChanges(change: { [market: string]: SimpleChange }) {
    let marketDetails = change?.market?.currentValue as Market;

    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();

    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketDisplayTitle;
      this.multiMarket.selections = [];

      marketDetails?.leftBetList?.forEach(oddDetails => {
        if (!oddDetails?.hideEntry) {
          this.scoreList.push(oddDetails.betName);
          this.leftBetList.set(oddDetails.betName, oddDetails);
        }
      })
      marketDetails?.rightBetList?.forEach(oddDetails => {
        if (!oddDetails?.hideEntry) {
          this.scoreList.push(oddDetails.betName);
          this.rightBetList.set(oddDetails.betName, oddDetails);
        }
      })

      this.scoreList?.sort((a, b) => (a > b ? -1 : 1));
      this.scoreList = Array.from(new Set(this.scoreList))?.slice(0, 3);

      if (marketDetails?.leftBetList?.length > 0 || marketDetails?.rightBetList?.length > 0)
        this.scoreList.forEach(score => {
          if (this.leftBetList.get(score) || this.rightBetList.get(score))
            if (!this.leftBetList.get(score)?.hideEntry || !this.rightBetList.get(score)?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: this.leftBetList.get(score)?.betOdds,
                hideHomePrice: this.leftBetList.get(score)?.hideOdds,
                hideHomeTitle: this.leftBetList.get(score)?.hideEntry,
                selectionTitle: score,
                awayPrice: this.rightBetList.get(score)?.betOdds,
                hideAwayPrice: this.rightBetList.get(score)?.hideOdds,
                hideAwayTitle: this.rightBetList.get(score)?.hideEntry,
              })
            }
        });
    }

  }

  constructor() { }

  ngOnInit(): void {
  }

}
