import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { CricketTemplateResult, MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-toscore-infirstst-inns',
  templateUrl: './toscore-infirstst-inns.component.html',
  styleUrls: ['./toscore-infirstst-inns.component.scss']
})
export class ToscoreInfirststInnsComponent implements OnInit {

  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.cricketContent.contentParameters.ToScore100in1stInning;
      this.multiMarket.selections = [];
      let rightItemsLength = marketDetails?.toScore100in1stInns?.length >= 10 ? 5 : Math.ceil(marketDetails?.toScore100in1stInns?.length / 2);

      for (let i = 0; i < rightItemsLength; i++) {
        if (!marketDetails?.toScore100in1stInns[i]?.hideEntry || !marketDetails?.toScore100in1stInns[rightItemsLength + i]?.hideEntry) {
          this.multiMarket.selections.push({
            homePrice: marketDetails?.toScore100in1stInns[i]?.betOdds,
            hideHomePrice: marketDetails?.toScore100in1stInns[i]?.hideOdds,
            homeSelectionTitle: marketDetails?.toScore100in1stInns[i]?.betName,
            hideHomeTitle: marketDetails?.toScore100in1stInns[i]?.hideEntry,

            awayPrice: marketDetails?.toScore100in1stInns[rightItemsLength + i]?.betOdds,
            hideAwayPrice: marketDetails?.toScore100in1stInns[rightItemsLength + i]?.hideOdds,
            awaySelectionTitle: marketDetails?.toScore100in1stInns[rightItemsLength + i]?.betName,
            hideAwayTitle: marketDetails?.toScore100in1stInns[rightItemsLength + i]?.hideEntry,
          })
        }
      }
    }
  }
  constructor() { }

  ngOnInit(): void {
  }
}
