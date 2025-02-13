import { Component, Input, OnInit } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from '../../models/general-codes-model';

@Component({
  selector: 'gn-multimarket-home-selection-away',
  templateUrl: './multimarket-home-selection-away.component.html',
  styleUrls: ['./multimarket-home-selection-away.component.scss']
})
export class MultimarketHomeSelectionAwayComponent implements OnInit {

  @Input() multiMarket: MultiMarket;
  @Input() iscorrect:string;
  nameLength = SelectionNameLength.Seventeen;

  constructor() { }

  ngOnInit(): void {
  }

}
