import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { CricketCdsTemplateResult } from '../../../models/cricket-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-total-sixes',
  templateUrl: './total-sixes.component.html',
  styleUrls: ['./total-sixes.component.scss']
})
export class TotalSixesComponent implements OnInit {
  @Input() matchData: CricketCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketCdsTemplateResult;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.TotalSixes;
    this.multiMarket.selections = [];

    if (marketDetails?.games?.length > 0) {
      let market = marketDetails?.games?.filter((item) => item?.isTotalSixes === true)
      if (market?.length > 0) {
        market.forEach(selection => {
          if (selection.isTotalSixes) {
            this.multiMarket.selections.push({
              homePrice: selection?.totalSixes?.homeBettingPrice,
              homeSelectionTitle: selection?.totalSixes?.homePlayer,
              awayPrice: selection?.totalSixes?.awayBettingPrice,
              awaySelectionTitle: selection?.totalSixes?.awayPlayer
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
