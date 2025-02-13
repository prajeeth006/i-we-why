import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'gn-avr-banner',
  templateUrl: './avr-banner.component.html',
  styleUrls: ['./avr-banner.component.scss']
})
export class AvrBannerComponent {

  @Input() leadTitle: string | null;
  @Input() title: string | null;
  @Input() countDownTitle: string | null;
  @Input() countDownValue$: Observable<string> | null;
  @Input() imageRight: string | null;
  @Input() distance: string | null;
  @Input() runnerCount: string | null;
  @Input() eachWay: string | null;

  constructor() { }

}
