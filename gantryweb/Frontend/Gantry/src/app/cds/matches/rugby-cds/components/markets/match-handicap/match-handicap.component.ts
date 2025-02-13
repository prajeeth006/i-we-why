import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { RugbyCdsTemplateResult } from '../../../models/rugby-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-handicap',
  templateUrl: './match-handicap.component.html',
  styleUrls: ['./match-handicap.component.scss']
})
export class MatchHandicapComponent implements OnInit {

  @Input() matchData: RugbyCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  gamesCount: number = 0;

  constructor() { }

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.Handicap;
    this.multiMarket.selections = [];
    
    this.gamesCount = marketDetails?.games?.length;
    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isHandicapBetting === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isHandicapBetting) {
            this.multiMarket.selections.push({
              homePrice: selection?.handicapBetting?.homePrice,
              homeSelectionTitle: selection?.handicapBetting?.homePlayer,
              awayPrice: selection?.handicapBetting?.awayPrice,
              awaySelectionTitle: selection?.handicapBetting?.awayPlayer
            })
          }
        });
      }

    }
  }

  ngOnInit(): void {
  }
}
