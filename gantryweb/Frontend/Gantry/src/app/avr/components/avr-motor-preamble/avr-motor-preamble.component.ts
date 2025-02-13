import { Component, Input } from '@angular/core';
import { AvrTemplate } from '../../models/avr-template.model';

@Component({
  selector: 'gn-avr-motor-preamble',
  templateUrl: './avr-motor-preamble.component.html',
  styleUrls: ['./avr-motor-preamble.component.scss']
})
export class AvrMotorPreambleComponent {
  @Input() result: AvrTemplate;


  constructor() {

  }
}
