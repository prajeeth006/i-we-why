import { Component, Input } from '@angular/core';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';

@Component({
  selector: 'gn-dark-theme-each-way',
  templateUrl: './dark-theme-each-way.component.html',
  styleUrls: ['./dark-theme-each-way.component.scss']
})
export class DarkThemeEachWayComponent {
  @Input() runnerCount: string;
  @Input() marketEachWayString: string;
  @Input() isEventResulted: boolean;
  @Input() horseRacingContent: HorseRacingContent;
  @Input() isNonRunner: boolean;
  @Input() raceNo: number;
  @Input() evrRaceType: string;
  @Input() distance: string;
  @Input() going: string;
  constructor() { }
}
