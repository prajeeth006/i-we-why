import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FootBallCdsTemplateResult } from '../../../models/foot-ball-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.scss']
})
export class MatchResultsComponent implements OnInit {
  @Input() matchData: FootBallCdsTemplateResult;

  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
    this.multiMarket.title = marketDetails?.footBallContent?.contentParameters?.Draw || ''
    this.multiMarket.selections = marketDetails?.finalResult?.selections;
    this.multiMarket.homeTitle = marketDetails?.footBallContent?.contentParameters?.Home
    this.multiMarket.awayTitle = marketDetails?.footBallContent?.contentParameters?.Away

  }
  constructor() { }

  ngOnInit(): void {
  }

}