import { Component, Input, OnInit } from '@angular/core';
import { DynamicComponent } from '../../../dynamic-screens-data/dynamic-component';

@Component({
  selector: 'app-tertiary-screen',
  templateUrl: './tertiary-screen.component.html',
  styleUrls: ['./tertiary-screen.component.scss']
})
export class TertiaryScreenComponent implements OnInit,DynamicComponent {

  constructor() { }
  @Input() data: any;

  ngOnInit(): void {
  }

}
