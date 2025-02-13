import { Component, Input, OnInit } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-money-line',
  templateUrl: './money-line.component.html',
  styleUrls: ['./money-line.component.scss']
})
export class MoneyLineComponent implements OnInit {

  @Input() market: Market;
  nameLength = SelectionNameLength.Seventeen;

  constructor() { }

  ngOnInit(): void {
  }

}
