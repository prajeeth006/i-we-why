import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gantry-single-screen',
  templateUrl: './gantry-single-screen.component.html',
  styleUrls: ['./gantry-single-screen.component.scss']
})
export class GantrySingleScreenComponent {

  constructor() { }
  @Input() data: any;


}
