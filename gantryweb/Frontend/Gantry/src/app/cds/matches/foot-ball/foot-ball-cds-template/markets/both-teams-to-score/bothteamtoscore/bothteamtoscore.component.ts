import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { FootBallCdsTemplateResult } from '../../../models/foot-ball-cds-template.model';

@Component({
  selector: 'gn-bothteamtoscore',
  templateUrl: './bothteamtoscore.component.html',
  styleUrls: ['./bothteamtoscore.component.scss']
})
export class BothteamtoscoreComponent implements OnInit {

  @Input() matchData: FootBallCdsTemplateResult;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
    this.multiMarket.title = marketDetails?.footBallContent?.contentParameters?.BothTeamsToScore;
    this.multiMarket.selections = marketDetails?.bothTeamScore?.selections;
  }
  constructor() { }

  ngOnInit(): void {
  }

}