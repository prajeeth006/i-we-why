import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../../dynamic-screens-data/dynamic-component';

@Component({
  selector: 'app-half-view',
  templateUrl: './half-view.component.html',
  styleUrls: ['./half-view.component.scss']
})
export class HalfViewComponent implements OnInit,DynamicComponent {

  constructor() { }
  @Input() data :any;

  ngOnInit(): void {
  }

}
