import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FootBallCdsTemplateResult } from '../../../models/foot-ball-cds-template.model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-results-both-teams-to-score',
  templateUrl: './match-results-both-teams-to-score.component.html',
  styleUrls: ['./match-results-both-teams-to-score.component.scss']
})
export class MatchResultsBothTeamsToScoreComponent implements OnInit {

  @Input() matchData: FootBallCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
    this.multiMarket.title = marketDetails?.footBallContent?.contentParameters?.MatchResultBothTeamsToScore
    this.multiMarket.selections = marketDetails?.matchResultBothTeamScore?.selections;
  }
  constructor() { }

  ngOnInit(): void {
  }

}