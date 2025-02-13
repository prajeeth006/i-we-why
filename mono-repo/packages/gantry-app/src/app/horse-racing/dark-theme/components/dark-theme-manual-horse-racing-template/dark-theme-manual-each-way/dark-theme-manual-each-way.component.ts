import { Component, Input } from '@angular/core';

import { HorseRacingContent } from '../../../../models/horseracing-content.model';

@Component({
    selector: 'gn-dark-theme-manual-each-way',
    templateUrl: './dark-theme-manual-each-way.component.html',
    styleUrls: ['./dark-theme-manual-each-way.component.scss'],
})
export class DarkThemeManualEachWayComponent {
    @Input() runnerCount: string;
    @Input() marketEachWayString: string;
    @Input() isEventResulted: boolean;
    @Input() horseRacingContent: HorseRacingContent;
    @Input() isNonRunner: boolean;
    @Input() raceNo: number;
    @Input() evrRaceType: string;
    @Input() distance: string;
    @Input() going: string;
    @Input() isHalfScreenType: boolean;

    constructor() {}
}
