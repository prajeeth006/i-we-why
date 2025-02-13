import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { BetDetails, SnookerCdsTemplateResult } from '../../../models/snooker-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-frame-betting',
  templateUrl: './frame-betting.component.html',
  styleUrls: ['./frame-betting.component.scss']
})
export class FrameBettingComponent implements OnInit {
  constructor() { }

  @Input() matchData: SnookerCdsTemplateResult;
  leftBetList: Map<string, BetDetails>;
  rightBetList: Map<string, BetDetails>;
  multiMarket: MultiMarket = new MultiMarket();
  scoreList: Array<string> = [];
  nameLength = SelectionNameLength.Seventeen;
  @Input() iscorrect:string;

  ngOnChanges(change: { [market: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;

    this.leftBetList = new Map<string, BetDetails>();
    this.rightBetList = new Map<string, BetDetails>();

    if (marketDetails) {
      this.multiMarket.title = marketDetails?.content?.contentParameters?.SelectedCorrectScores;
      this.multiMarket.selections = [];

      marketDetails?.frameBetting?.homeTeamScorerList?.forEach(oddDetails => {
        this.scoreList.push(oddDetails.betName);
        this.leftBetList.set(oddDetails.betName, oddDetails);
      })
      marketDetails?.frameBetting?.awayTeamScorerList?.forEach(oddDetails => {
        this.scoreList.push(oddDetails.betName);
        this.rightBetList.set(oddDetails.betName, oddDetails);
      })

      this.scoreList?.sort((a, b) => (a > b ? -1 : 1));
      this.scoreList = Array.from(new Set(this.scoreList))?.slice(0, 3);

      if (marketDetails?.frameBetting?.homeTeamScorerList?.length > 0 || marketDetails?.frameBetting?.homeTeamScorerList?.length > 0)
        this.scoreList.forEach(score => {
          if (this.leftBetList.get(score) || this.rightBetList.get(score))
            this.multiMarket.selections.push({
              homePrice: this.leftBetList.get(score)?.betOdds,
              selectionTitle: score,
              awayPrice: this.rightBetList.get(score)?.betOdds,
            })
        });
    }

  }

  ngOnInit(): void {
  }
}
