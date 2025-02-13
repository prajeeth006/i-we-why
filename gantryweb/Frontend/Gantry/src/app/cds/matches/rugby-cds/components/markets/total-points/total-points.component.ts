import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { RugbyCdsTemplateResult } from '../../../models/rugby-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-total-points',
  templateUrl: './total-points.component.html',
  styleUrls: ['./total-points.component.scss']
})
export class TotalPointsComponent implements OnInit{

  constructor() { }

  @Input() matchData: RugbyCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  gamesCount: number = 0;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.TotalPoints;
    this.multiMarket.selections = [];
    
    this.gamesCount = marketDetails?.games?.length;
    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isTotalPointsBetting === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isTotalPointsBetting) {
            this.multiMarket.selections.push({
              homePrice: selection?.totalPointsBetting?.awayPrice,
              homeSelectionTitle: selection?.totalPointsBetting?.awayPlayer,
              awayPrice: selection?.totalPointsBetting?.homePrice,
              awaySelectionTitle: selection?.totalPointsBetting?.homePlayer
            })
          }
        });
      }

    }
  }

  ngOnInit(): void {
  }

}
