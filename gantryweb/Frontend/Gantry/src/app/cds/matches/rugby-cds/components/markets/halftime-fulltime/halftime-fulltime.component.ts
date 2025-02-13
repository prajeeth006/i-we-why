import { Component, Input, SimpleChange } from '@angular/core';
import { RugbyCdsTemplateResult } from '../../../models/rugby-cds-template.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-halftime-fulltime',
  templateUrl: './halftime-fulltime.component.html',
  styleUrls: ['./halftime-fulltime.component.scss']
})
export class HalftimeFulltimeComponent {
  constructor() { }

  @Input() market: RugbyCdsTemplateResult;
  nameLength = SelectionNameLength.Seventeen;
  gamesCount: number = 0;

  ngOnChanges(change: { [market: string]: SimpleChange }) {
    let marketDetails = change?.market?.currentValue;
    this.gamesCount = marketDetails?.games?.length;
  }
}
