import { Component, Input, SimpleChange } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { BoxingCdsContent, MultiMarket } from '../../../models/boxing-cds-content.model';



@Component({
  selector: 'gn-method-of-victory',
  templateUrl: './method-of-victory.component.html',
  styleUrls: ['./method-of-victory.component.scss']
})
export class MethodOfVictoryComponent {
  @Input() matchData: BoxingCdsContent;
  multiMarket: MultiMarket = new MultiMarket();
  nameLength = SelectionNameLength.Seventeen;
  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails =  change?.matchData?.currentValue  as BoxingCdsContent;
    this.multiMarket.title = marketDetails?.content?.contentParameters?.MethodOfVictory;
    this.multiMarket.selections = marketDetails?.methodOfVictory?.selections;
    }

}
