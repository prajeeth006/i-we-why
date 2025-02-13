import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { CricketCdsTemplateResult } from '../../../models/cricket-cds-template.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-toscore-infirstst-inns',
  templateUrl: './toscore-infirstst-inns.component.html',
  styleUrls: ['./toscore-infirstst-inns.component.scss']
})
export class ToscoreInfirststInnsComponent implements OnInit {
  @Input() matchData: CricketCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketCdsTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.content?.contentParameters?.ToScore100in1stInning;
      this.multiMarket.selections = [];
      let rightItemsLength = marketDetails?.topScore100List?.length >= 10 ? 5 : Math.ceil(marketDetails?.topScore100List?.length / 2);

      for (let i = 0; i < rightItemsLength; i++) {
        this.multiMarket.selections.push({
          homePrice: marketDetails?.topScore100List[i]?.betOdds,
          homeSelectionTitle: marketDetails?.topScore100List[i]?.betName,

          awayPrice: marketDetails?.topScore100List[rightItemsLength + i]?.betOdds,
          awaySelectionTitle: marketDetails?.topScore100List[rightItemsLength + i]?.betName,

        })

      }
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
