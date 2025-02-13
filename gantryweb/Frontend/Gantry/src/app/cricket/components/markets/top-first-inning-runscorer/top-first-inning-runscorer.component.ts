import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket, MultiMarketSelection } from 'src/app/common/models/multimarket-selection';
import { CricketTemplateResult, MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-top-first-inning-runscorer',
  templateUrl: './top-first-inning-runscorer.component.html',
  styleUrls: ['./top-first-inning-runscorer.component.scss']
})
export class TopFirstInningRunscorerComponent implements OnInit {

  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();
  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    
    let marketDetails = change?.matchData?.currentValue as CricketTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.cricketContent.contentParameters.TopFirstInningsRunScorer;
      this.multiMarket.selections = [];

      if ((marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList && marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList?.length > 0)
        || (marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList && marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList?.length > 0))
        marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList?.sort(function (a, b) {
          if (a.hideEntry > b.hideEntry) return 1;
          if (a.hideEntry < b.hideEntry) return -1;
          return 0;
        });

      marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList?.sort(function (a, b) {
        if (a.hideEntry > b.hideEntry) return 1;
        if (a.hideEntry < b.hideEntry) return -1;
        return 0;
      });
      Array.from({ length: 7 }).map((x, i) => {
        let marketItem: MultiMarketSelection = new MultiMarketSelection();
        if (marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList && marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]) {
          if (!marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]?.hideEntry) {
            marketItem.homePrice = marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]?.betOdds ?? " ";
            marketItem.hideHomePrice = marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]?.hideOdds ?? undefined;
            marketItem.hideHomeTitle = marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]?.hideEntry ?? false;
            marketItem.homeSelectionTitle = marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList[i]?.betName ?? " ";
          }
        }

        if (marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList && marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]) {
          if (!marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]?.hideEntry) {
            marketItem.awayPrice = marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]?.betOdds ?? " ";
            marketItem.hideAwayPrice = marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]?.hideOdds ?? undefined;
            marketItem.hideAwayTitle = marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]?.hideEntry ?? false;
            marketItem.awaySelectionTitle = marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList[i]?.betName ?? " ";
          }
        }

        if (marketDetails?.top1stInningRunScorer?.homeTeamTopRunScorerList || marketDetails?.top1stInningRunScorer?.awayTeamTopRunScorerList) {
          this.multiMarket.selections.push(marketItem);
        }

      });
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
