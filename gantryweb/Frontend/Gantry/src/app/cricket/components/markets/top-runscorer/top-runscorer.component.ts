import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { CricketTemplateResult, MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-top-runscorer',
  templateUrl: './top-runscorer.component.html',
  styleUrls: ['./top-runscorer.component.scss']
})
export class TopRunscorerComponent implements OnInit {

  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.cricketContent.contentParameters.TopRunScorer;
      this.multiMarket.selections = [];
      if (marketDetails?.topRunScorer?.homeTeamTopRunScorerList?.length > 0 || marketDetails?.topRunScorer?.awayTeamTopRunScorerList?.length > 0) {
        marketDetails?.topRunScorer?.homeTeamTopRunScorerList?.sort(function (a, b) {
          if (a.hideEntry > b.hideEntry) return 1;
          if (a.hideEntry < b.hideEntry) return -1;
          return 0;
        });

        marketDetails?.topRunScorer?.awayTeamTopRunScorerList?.sort(function (a, b) {
          if (a.hideEntry > b.hideEntry) return 1;
          if (a.hideEntry < b.hideEntry) return -1;
          return 0;
        });
        Array.from({ length: 5 }).map((x, i) => {
          if ((marketDetails?.topRunScorer?.homeTeamTopRunScorerList && marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]) || (marketDetails?.topRunScorer?.awayTeamTopRunScorerList && marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]))
            if (!marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]?.hideEntry || !marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: marketDetails?.topRunScorer?.homeTeamTopRunScorerList ? marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]?.betOdds : " ",
                hideHomePrice: marketDetails?.topRunScorer?.homeTeamTopRunScorerList ? marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]?.hideOdds : undefined,
                hideHomeTitle: marketDetails?.topRunScorer?.homeTeamTopRunScorerList ? marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]?.hideEntry : undefined,
                homeSelectionTitle: marketDetails?.topRunScorer?.homeTeamTopRunScorerList ? marketDetails?.topRunScorer?.homeTeamTopRunScorerList[i]?.betName : " ",
                awayPrice: marketDetails?.topRunScorer?.awayTeamTopRunScorerList ? marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]?.betOdds : " ",
                hideAwayPrice: marketDetails?.topRunScorer?.awayTeamTopRunScorerList ? marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]?.hideOdds : undefined,
                awaySelectionTitle: marketDetails?.topRunScorer?.awayTeamTopRunScorerList ? marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]?.betName : " ",
                hideAwayTitle: marketDetails?.topRunScorer?.awayTeamTopRunScorerList ? marketDetails?.topRunScorer?.awayTeamTopRunScorerList[i]?.hideEntry : undefined,
              })
            }
        });
      }

    }

  }
  constructor() { }

  ngOnInit(): void {
  }

}
