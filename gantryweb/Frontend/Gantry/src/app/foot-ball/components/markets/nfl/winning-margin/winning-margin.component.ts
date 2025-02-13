import { Component, Input, OnInit } from '@angular/core';
import { Market } from 'src/app/foot-ball/models/football.model';

@Component({
  selector: 'gn-winning-margin',
  templateUrl: './winning-margin.component.html',
  styleUrls: ['./winning-margin.component.scss']
})
export class WinningMarginComponent implements OnInit {

  @Input() market: Market;
  @Input() isRugbyPage: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
