import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { BoxingCdsContent } from '../../../models/boxing-cds-content.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';

@Component({
  selector: 'gn-fight-result',
  templateUrl: './fight-result.component.html',
  styleUrls: ['./fight-result.component.scss']
})
export class FightResultComponent implements OnInit {

  @Input() matchData: BoxingCdsContent;
  @Input() isTestMatch: boolean;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as BoxingCdsContent;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.Draw || ''
    this.multiMarket.selections = marketDetails?.finalResult?.selections;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
