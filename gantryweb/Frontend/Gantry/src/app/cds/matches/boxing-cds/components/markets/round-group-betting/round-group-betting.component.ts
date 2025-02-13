import { Component, Input, SimpleChange } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BoxingCdsContent } from '../../../models/boxing-cds-content.model';

@Component({
  selector: 'gn-round-group-betting',
  templateUrl: './round-group-betting.component.html',
  styleUrls: ['./round-group-betting.component.scss']
})
export class RoundGroupBettingComponent {
  @Input() matchData: BoxingCdsContent;
  nameLength = SelectionNameLength.Seventeen;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change.matchData.currentValue as BoxingCdsContent;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.RoundGroupBetting;
    this.multiMarket.selections = marketDetails?.roundGroupBetting?.selections;
  }
  ngOnInit() {
  }



  constructor() { }
}
