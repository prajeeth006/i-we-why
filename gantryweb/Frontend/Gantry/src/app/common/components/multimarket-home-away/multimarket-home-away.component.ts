import { Component, Input, OnInit } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { SelectionNameLength } from '../../models/general-codes-model';

@Component({
  selector: 'gn-multimarket-home-away',
  templateUrl: './multimarket-home-away.component.html',
  styleUrls: ['./multimarket-home-away.component.scss']
})
export class MultimarketHomeAwayComponent implements OnInit {

  @Input() multiMarket: MultiMarket;
  nameLength = SelectionNameLength.Seventeen;

  constructor() { }

  ngOnInit(): void {
  }

}
