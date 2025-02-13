import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { RugbyCdsTemplateResult } from '../../../models/rugby-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-firsthalf-handicap',
  templateUrl: './firsthalf-handicap.component.html',
  styleUrls: ['./firsthalf-handicap.component.scss']
})
export class FirsthalfHandicapComponent implements OnInit {

  @Input() matchData: RugbyCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  gamesCount: number = 0;

  constructor() { }

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.FirstHalfHandicap;
    this.multiMarket.selections = [];

    this.gamesCount = marketDetails?.games?.length;
    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isFirstHanicapBetting === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isFirstHanicapBetting) {
            this.multiMarket.selections.push({
              homePrice: selection?.firstHanicapBetting?.homePrice,
              homeSelectionTitle: selection?.firstHanicapBetting?.homePlayer,
              awayPrice: selection?.firstHanicapBetting?.awayPrice,
              awaySelectionTitle: selection?.firstHanicapBetting?.awayPlayer
            })
          }
        });
      }

    }
  }

  ngOnInit(): void {
  }
}
