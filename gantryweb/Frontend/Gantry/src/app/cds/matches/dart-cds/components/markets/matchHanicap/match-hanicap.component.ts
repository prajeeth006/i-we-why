import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { DartCdsTemplateResult } from '../../../models/dart-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-hanicap',
  templateUrl: './match-hanicap.component.html',
  styleUrls: ['./match-hanicap.component.scss']
})
export class MatchHanicapComponent implements OnInit {
  constructor() { }

  @Input() matchData: DartCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as DartCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.Handicap;
    this.multiMarket.selections = [];
    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isMatchHandicap === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isMatchHandicap) {
            this.multiMarket.selections.push({
              homePrice: selection?.matchHanicap?.homePrice,
              homeSelectionTitle: selection?.matchHanicap?.homePlayer,
              awayPrice: selection?.matchHanicap?.awayPrice,
              awaySelectionTitle: selection?.matchHanicap?.awayPlayer
            })
          }
        });
      }

    }
  }
  ngOnInit(): void {
  }
}
