import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FootBallCdsTemplateResult } from '../../models/foot-ball-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-correct-score',
  templateUrl: './correct-score.component.html',
  styleUrls: ['./correct-score.component.scss']
})
export class CorrectScoreComponent implements OnInit {
  @Input() matchData: FootBallCdsTemplateResult;

  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
    this.multiMarket.selections = marketDetails?.correctScore?.selections;
  }
  constructor() { }
  ngOnInit(): void {
  }

}