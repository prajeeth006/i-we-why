import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { RugbyCdsTemplateResult, Game } from '../../../models/rugby-cds-template.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-betting',
  templateUrl: './match-betting.component.html',
  styleUrls: ['./match-betting.component.scss']
})
export class MatchBettingComponent implements OnInit {
  @Input() matchData: RugbyCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  gamesCount: number = 0;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.Draw;
    this.multiMarket.marketVersesName = "";
    this.multiMarket.selections = [];

    this.gamesCount = marketDetails?.games?.length;
    if (marketDetails?.games?.length > 0) {
      let market: Game[];
      market = marketDetails?.games?.filter((item) => item?.isMatchBetting === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isMatchBetting) {
            this.multiMarket.selections.push({
              selectionTitle: selection?.gameName,
              homePrice: selection?.matchBetting?.homePrice,
              homeSelectionTitle: selection?.matchBetting?.homePlayer,
              awayPrice: selection?.matchBetting?.awayPrice,
              awaySelectionTitle: selection?.matchBetting?.awayPlayer,
              drawTitle: selection?.matchBetting?.drawPlayer,
              drawPrice: selection?.matchBetting?.drawPrice,
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
