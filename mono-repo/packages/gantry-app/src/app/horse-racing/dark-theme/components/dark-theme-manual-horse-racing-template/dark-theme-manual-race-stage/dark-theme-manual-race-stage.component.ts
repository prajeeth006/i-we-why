import { Component, Input, OnChanges } from '@angular/core';

import { HorseRacingRunnersResult } from '../../../../models/horse-racing-template.model';

@Component({
    selector: 'gn-dark-theme-manual-race-stage',
    templateUrl: './dark-theme-manual-race-stage.component.html',
    styleUrls: ['./dark-theme-manual-race-stage.component.scss'],
})
export class DarkThemeManualRaceStageComponent implements OnChanges {
    @Input() horseRacingResult: HorseRacingRunnersResult;
    currentStage: string;
    raceStage: string;

    constructor() {}

    ngOnChanges(): void {
        this.setInitialCurrentStage();
    }

    setInitialCurrentStage() {
        this.currentStage = this.horseRacingResult?.defaultPriceColumn;
        if (this.horseRacingResult?.isRaceOff) {
            this.currentStage = this.horseRacingResult?.horseRacingContent?.contentParameters?.RaceOff ?? '';
        }
    }
}
