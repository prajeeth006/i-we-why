import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BetDetails, MatchDataList } from 'src/app/dart/models/dart-template.model';

@Component({
  selector: 'gn-correct-score',
  templateUrl: './correct-score.component.html',
  styleUrls: ['./correct-score.component.scss']
})
export class CorrectScoreComponent implements OnInit {

  @Input() matchData: MatchDataList;

  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  multiMarket: MultiMarket = new MultiMarket();
  scoreList: Array<string> = [];

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as MatchDataList;

    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();

    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketName;
      this.multiMarket.selections = [];

      marketDetails?.homeTeamListDetails?.forEach(oddDetails => {
        this.scoreList.push(oddDetails.betName);
        this.leftBetList.set(oddDetails.betName, oddDetails);
      })
      marketDetails?.awayTeamListDetails?.forEach(oddDetails => {
        this.scoreList.push(oddDetails.betName);
        this.rightBetList.set(oddDetails.betName, oddDetails);
      })

      this.scoreList?.sort((a, b) => (a > b ? -1 : 1));
      this.scoreList = Array.from(new Set(this.scoreList))?.slice(0, 3);
      if (marketDetails?.homeTeamListDetails?.length > 0 || marketDetails?.awayTeamListDetails?.length > 0)
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
