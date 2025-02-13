import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FootBallCdsTemplateResult } from '../../models/foot-ball-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-first-goalscorer',
  templateUrl: './first-goalscorer.component.html',
  styleUrls: ['./first-goalscorer.component.scss']
})
export class FirstGoalscorerComponent implements OnInit {
  @Input() matchData: FootBallCdsTemplateResult;

  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
    this.multiMarket.selections = marketDetails?.firstGoalScorer?.selections;
    this.multiMarket.title = marketDetails?.footBallContent?.contentParameters?.FirstGoalScorer;
  }
  constructor() { }

  ngOnInit(): void {
  }

}