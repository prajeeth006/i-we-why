import { Component, Input } from '@angular/core';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';

@Component({
  selector: 'gn-each-way',
  templateUrl: './each-way.component.html',
  styleUrls: ['./each-way.component.scss']
})
export class EachWayComponent {
  @Input() runnerCount: string;
  @Input() marketEachWayString: string;
  @Input() racingPostTipHorseName: string;
  @Input() isEventResulted: boolean;
  @Input() horseRacingContent: HorseRacingContent;
  @Input() isNonRunner: boolean;
  @Input() isHalfScreenType: boolean;
  constructor() { }
}
