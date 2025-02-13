import { Component, Input, OnInit } from '@angular/core';
import { SelectionNameLength } from '../../models/general-codes-model';
import { MultiMarket } from '../../models/multimarket-selection';

@Component({
  selector: 'gn-multimarket-match-betting',
  templateUrl: './multimarket-match-betting.component.html',
  styleUrls: ['./multimarket-match-betting.component.scss']
})
export class MultimarketMatchBettingComponent implements OnInit {

  @Input() multiMarket: MultiMarket;
  nameLength = SelectionNameLength.Seventeen;

  constructor() { }

  ngOnInit(): void {
  }

}
