import { Component, Input, OnInit } from '@angular/core';
import { DynamicComponent } from '../../../dynamic-screens-data/dynamic-component';

@Component({
  selector: 'app-multiview-screen',
  templateUrl: './multiview-screen.component.html',
  styleUrls: ['./multiview-screen.component.scss']
})
export class MultiviewScreenComponent implements OnInit,DynamicComponent {

  constructor() { }
  @Input() data: any;
  ngOnInit(): void {
  }

}
