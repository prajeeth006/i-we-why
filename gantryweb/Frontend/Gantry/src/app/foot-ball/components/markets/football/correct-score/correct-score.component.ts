import { Component, Input, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BetDetails, Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-correct-score',
  templateUrl: './correct-score.component.html',
  styleUrls: ['./correct-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CorrectScoreComponent {

  scoreList: Array<string> = ["1-0", "2-0", "2-1", "3-0", "3-1", "3-2", "4-0", "4-1"]
  drawScoreList: Array<string> = ["0-0", "1-1", "2-2", "3-3", "", "", "", ""]

  @Input() market: Market;

  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  drawBetList: Map<string, BetDetails>;
  multiMarket: MultiMarket = new MultiMarket();

  loadMultiMarketSelectionsData(marketDetails: Market) {
    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();
    this.drawBetList = new Map<string, BetDetails>();


    if (marketDetails && (marketDetails?.leftBetList.length > 0 || marketDetails?.rightBetList.length > 0 || marketDetails?.drawBetList.length > 0)) {
      this.multiMarket.title = marketDetails.marketDisplayTitle;
      this.multiMarket.selections = [];


      marketDetails?.leftBetList?.forEach(oddDetails => {
        this.leftBetList.set(oddDetails.betName, oddDetails);
      })
      marketDetails?.rightBetList?.forEach(oddDetails => {
        this.rightBetList.set(oddDetails.betName, oddDetails);
      })
      marketDetails?.drawBetList?.forEach(oddDetails => {
        this.drawBetList.set(oddDetails.betName, oddDetails);
      })

      Array.from({ length: 8 }).map((x, i) => {   // looping for 8 times to load data 

        this.multiMarket.selections.push({
          homePrice: this.leftBetList.get(this.scoreList[i])?.betOdds,
          hideHomePrice: this.leftBetList.get(this.scoreList[i])?.hideOdds,
          hideHomeTitle: this.leftBetList.get(this.scoreList[i])?.hideEntry,
          homeSelectionTitle: this.scoreList[i],

          awayPrice: this.rightBetList.get(this.scoreList[i])?.betOdds,
          hideAwayPrice: this.rightBetList.get(this.scoreList[i])?.hideOdds,
          hideAwayTitle: this.rightBetList.get(this.scoreList[i])?.hideEntry,
          awaySelectionTitle: this.scoreList[i],

          drawPrice: this.drawBetList.get(this.drawScoreList[i])?.betOdds,
          hideDrawPrice: this.drawBetList.get(this.drawScoreList[i])?.hideOdds,
          hideDrawTitle: this.drawBetList.get(this.drawScoreList[i])?.hideEntry,
          drawTitle: this.drawScoreList[i],

        })

      })
    }
    return this.multiMarket.selections;
  }

  ngOnChanges(change: { [market: string]: SimpleChange }) {
    let marketDetails = change.market.currentValue as Market;
    this.loadMultiMarketSelectionsData(marketDetails);
  }

  constructor() { }


}
