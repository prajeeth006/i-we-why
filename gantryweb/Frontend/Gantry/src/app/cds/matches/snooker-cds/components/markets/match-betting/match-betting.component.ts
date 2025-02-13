import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { SnookerCdsTemplateResult, Game } from '../../../models/snooker-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-betting',
  templateUrl: './match-betting.component.html',
  styleUrls: ['./match-betting.component.scss']
})
export class MatchBettingComponent implements OnInit {

  constructor() { }

  @Input() matchData: SnookerCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.MatchBetting;
    this.multiMarket.marketVersesName = marketDetails?.content?.contentParameters?.V;
    this.multiMarket.selections = [];
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
            })
          }
        });
      }

    }
  }

  ngOnInit(): void {
  }

}
