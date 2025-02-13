import { Component, Input, SimpleChange } from '@angular/core';
import { BetDetails, MatchDataList } from 'src/app/boxing/models/boxing-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';

@Component({
  selector: 'gn-winning-round-group',
  templateUrl: './winning-round-group.component.html',
  styleUrls: ['./winning-round-group.component.scss']
})
export class WinningRoundGroupComponent {
  @Input() matchData: MatchDataList;


  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  roundValues: Array<string> = ["1-3", "4-6", "7-9", "10-12"];
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();

    let marketDetails = change.matchData.currentValue as MatchDataList;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.marketDisplayTitle;
      this.multiMarket.selections = [];


      marketDetails?.homeTeamListDetails?.forEach(oddDetails => {
        switch (oddDetails.betName) {
          case 'ROUNDS 1-3': this.leftBetList.set(this.roundValues[0], oddDetails)
            break;
          case 'ROUNDS 4-6': this.leftBetList.set(this.roundValues[1], oddDetails)
            break;
          case 'ROUNDS 7-9': this.leftBetList.set(this.roundValues[2], oddDetails)
            break;
          case 'ROUNDS 10-12': this.leftBetList.set(this.roundValues[3], oddDetails)
            break;
        }
      })
      marketDetails?.awayTeamListDetails?.forEach(oddDetails => {
        switch (oddDetails.betName) {
          case 'ROUNDS 1-3': this.rightBetList.set(this.roundValues[0], oddDetails)
            break;
          case 'ROUNDS 4-6': this.rightBetList.set(this.roundValues[1], oddDetails)
            break;
          case 'ROUNDS 7-9': this.rightBetList.set(this.roundValues[2], oddDetails)
            break;
          case 'ROUNDS 10-12': this.rightBetList.set(this.roundValues[3], oddDetails)
            break;
        }
      })

      if (marketDetails?.homeTeamListDetails?.length > 0 || marketDetails?.awayTeamListDetails?.length > 0)
        this.roundValues.forEach(round => {
          if (this.leftBetList.get(round) || this.rightBetList.get(round))
            if (!this.leftBetList.get(round)?.hideEntry || !this.rightBetList.get(round)?.hideEntry) {
              this.multiMarket.selections.push({
                selectionTitle: round,
                homePrice: this.leftBetList.get(round)?.betOdds,
                hideHomePrice: this.leftBetList.get(round)?.hideOdds,
                hideHomeTitle: this.leftBetList.get(round)?.hideEntry,
                awayPrice: this.rightBetList.get(round)?.betOdds,
                hideAwayPrice: this.rightBetList.get(round)?.hideOdds,
                hideAwayTitle: this.rightBetList.get(round)?.hideEntry,
              });
            }
        });
    }

  }




  constructor() { }
}
