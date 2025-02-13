import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CricketCdsTemplateResult, Game } from '../../../models/cricket-cds-template.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';

@Component({
  selector: 'gn-top-runscorer',
  templateUrl: './top-runscorer.component.html',
  styleUrls: ['./top-runscorer.component.scss']
})
export class TopRunscorerComponent implements OnInit {
  @Input() matchData: CricketCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  constructor() { }

  ngOnInit(): void {
  }

  prepareResult(market: Game[], maxLimit: number) {
    Array.from({ length: maxLimit }).map((x, i) => {
      if (market[0]?.topRunScorer?.homeTeamTopRunScorerList?.length > 0 || market[1]?.topRunScorer?.awayTeamTopRunScorerList?.length > 0) {
        this.multiMarket.selections.push({
          homePrice: market[0]?.topRunScorer?.homeTeamTopRunScorerList ? market[0]?.topRunScorer?.homeTeamTopRunScorerList[i]?.betOdds : "",
          homeSelectionTitle: market[0]?.topRunScorer?.homeTeamTopRunScorerList ? market[0]?.topRunScorer?.homeTeamTopRunScorerList[i]?.betName : "",
          awayPrice: market[1]?.topRunScorer?.awayTeamTopRunScorerList ? market[1]?.topRunScorer?.awayTeamTopRunScorerList[i]?.betOdds : "",
          awaySelectionTitle: market[1]?.topRunScorer?.awayTeamTopRunScorerList ? market[1]?.topRunScorer?.awayTeamTopRunScorerList[i]?.betName : ""
        })
      }

    })
  }

  ngOnChanges(change: SimpleChanges) {
    let marketDetails = change?.matchData?.currentValue as CricketCdsTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.isTestMatch ? marketDetails?.content?.contentParameters?.TopFirstInningsRunScorer : marketDetails?.content?.contentParameters?.TopRunScorer;
      this.multiMarket.selections = [];
      if (marketDetails?.games?.length > 0) {
        let market = marketDetails?.games?.filter((item) => item?.isHomeTopRunscorer === true || item?.isAwayTopRunscorer === true)
        if (market?.length > 0) {
          market = market?.sort((a, b) => Number(a?.topRunScorer?.order) - Number(b?.topRunScorer?.order));
          let maxLimit = marketDetails.isTestMatch ? 7 : 5;
          let homeLength = market[0]?.topRunScorer?.homeTeamTopRunScorerList?.length;
          let awayLength = market[1]?.topRunScorer?.awayTeamTopRunScorerList?.length;
          let maxSelectionLength = Math.max(homeLength, awayLength);
          if (maxSelectionLength <= maxLimit) {
            this.prepareResult(market, maxSelectionLength);
          }
          else {
            this.prepareResult(market, maxLimit);
          }
        }

      }

    }
  }


}
