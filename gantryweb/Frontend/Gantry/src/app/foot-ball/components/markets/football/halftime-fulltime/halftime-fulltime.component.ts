import { Component, Input, OnInit } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-halftime-fulltime',
  templateUrl: './halftime-fulltime.component.html',
  styleUrls: ['./halftime-fulltime.component.scss']
})
export class HalftimeFulltimeComponent implements OnInit {

  @Input() market: Market;
  nameLength = SelectionNameLength.Seventeen;

  constructor() { }

  ngOnInit(): void {
  }

}
