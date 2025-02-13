import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { CricketCdsTemplateResult, Game } from '../../../models/cricket-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-betting',
  templateUrl: './match-betting.component.html',
  styleUrls: ['./match-betting.component.scss']
})
export class MatchBettingComponent implements OnInit {
  @Input() matchData: CricketCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails = change?.matchData?.currentValue as CricketCdsTemplateResult;
    this.multiMarket.title = marketDetails.isTestMatch ? marketDetails?.content?.contentParameters?.DRAW
      : marketDetails.isSuperOver ? marketDetails?.content?.contentParameters?.SuperOver
        : marketDetails?.content?.contentParameters?.MatchBetting;
    this.multiMarket.marketVersesName = marketDetails.isTestMatch == false ? marketDetails?.content?.contentParameters?.Vs : "";
    this.multiMarket.selections = [];
    if (marketDetails?.games?.length > 0) {
      let market: Game[];
      if (marketDetails.isTestMatch) {
        market = marketDetails?.games?.filter((item) => item?.isTestMatchBetting === true)
      }
      else if (marketDetails.isSuperOver) {
        market = marketDetails?.games?.filter((item) => item?.isSuperOverBetting === true)
      }
      else {
        market = marketDetails?.games?.filter((item) => item?.isMatchBetting === true)
      }
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isMatchBetting || selection.isTestMatchBetting || selection.isSuperOverBetting) {
            this.multiMarket.selections.push({
              selectionTitle: selection?.gameName,
              homePrice: selection?.matchBetting?.homeBettingPrice,
              homeSelectionTitle: selection?.matchBetting?.homePlayer,
              awayPrice: selection?.matchBetting?.awayBettingPrice,
              awaySelectionTitle: selection?.matchBetting?.awayPlayer,
              drawTitle: marketDetails.isTestMatch ? selection?.matchBetting?.drawPlayer : "",
              drawPrice: marketDetails.isTestMatch ? selection?.matchBetting?.drawBettingPrice : "",
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
