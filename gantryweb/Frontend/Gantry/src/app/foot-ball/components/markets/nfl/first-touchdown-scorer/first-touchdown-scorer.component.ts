import { Component, Input, OnInit } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-first-touchdown-scorer',
  templateUrl: './first-touchdown-scorer.component.html',
  styleUrls: ['./first-touchdown-scorer.component.scss']
})
export class FirstTouchdownScorerComponent implements OnInit {

  @Input() market: Market;
  nameLength = SelectionNameLength.Seventeen;
  constructor() { }

  ngOnInit(): void {
  }

}
