import { Component, Input, SimpleChange } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { FootBallCdsTemplateResult } from '../../../models/foot-ball-cds-template.model';
import { FootBallDataContent } from '../../../models/foot-ball-model';

@Component({
  selector: 'gn-totalgoalsinthematch',
  templateUrl: './totalgoalsinthematch.component.html',
  styleUrls: ['./totalgoalsinthematch.component.scss']
})
export class TotalgoalsinthematchComponent {
  @Input() matchData: FootBallCdsTemplateResult;

  nameLength = SelectionNameLength.Seventeen;
  multiMarket: MultiMarket = new MultiMarket();
  footBallContent : FootBallDataContent

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
   let marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
   this.multiMarket.title = marketDetails?.footBallContent?.contentParameters?.TotalGoalsInTheMatch;
   this.multiMarket.homeTitle = marketDetails?.footBallContent?.contentParameters?.Over
   this.multiMarket.awayTitle = marketDetails?.footBallContent?.contentParameters?.Under
   this.multiMarket.selections = marketDetails?.totalGoals?.selections?.sort((a: any, b:any) => a.name - b.name);
   this.footBallContent = marketDetails?.footBallContent;

  }
  ngOnInit() {
  }



  constructor() { }

}
