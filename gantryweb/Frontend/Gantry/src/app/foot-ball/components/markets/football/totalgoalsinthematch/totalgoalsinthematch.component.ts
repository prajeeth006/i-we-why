import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BetDetails, FootBallDataContent, Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-totalgoalsinthematch',
  templateUrl: './totalgoalsinthematch.component.html',
  styleUrls: ['./totalgoalsinthematch.component.scss']
})
export class TotalgoalsinthematchComponent implements OnInit {

  @Input() market: Market;
  @Input() content: FootBallDataContent;
  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  multiMarket: MultiMarket = new MultiMarket();

  handicapValues: Array<string> = ["0.5", "1.5", "2.5", "3.5"]

  ngOnChanges(change: { [market: string]: SimpleChange }) {
    let marketDetails = change.market.currentValue as Market;
    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();
    if (marketDetails) {
      this.multiMarket.title = marketDetails.marketDisplayTitle;
      this.multiMarket.homeTitle = marketDetails.marketLeftTitle;
      this.multiMarket.awayTitle = marketDetails.marketRightTitle;
      this.multiMarket.selections = [];

      marketDetails?.leftBetList?.forEach(oddDetails => {
        switch (oddDetails.betName) {
          case '0.5': this.leftBetList.set('0.5', oddDetails)
            break;
          case '1.5': this.leftBetList.set('1.5', oddDetails)
            break;
          case '2.5': this.leftBetList.set('2.5', oddDetails)
            break;
          case '3.5': this.leftBetList.set('3.5', oddDetails)
            break;
        }
      })
      marketDetails?.rightBetList?.forEach(oddDetails => {
        switch (oddDetails.betName) {
          case '0.5': this.rightBetList.set('0.5', oddDetails)
            break;
          case '1.5': this.rightBetList.set('1.5', oddDetails)
            break;
          case '2.5': this.rightBetList.set('2.5', oddDetails)
            break;
          case '3.5': this.rightBetList.set('3.5', oddDetails)
            break;
        }
      })

      if (marketDetails?.leftBetList?.length > 0 || marketDetails?.rightBetList?.length > 0)
        this.handicapValues.forEach(score => {
          if (this.leftBetList.get(score) || this.rightBetList.get(score))
            if (!this.leftBetList.get(score)?.hideEntry || !this.rightBetList.get(score)?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: this.leftBetList.get(score)?.betOdds,
                hideHomePrice: this.leftBetList.get(score)?.hideOdds,
                hideHomeTitle: this.leftBetList.get(score)?.hideEntry,
                selectionTitle: score + ' ' + this.content?.contentParameters.Goals,
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
