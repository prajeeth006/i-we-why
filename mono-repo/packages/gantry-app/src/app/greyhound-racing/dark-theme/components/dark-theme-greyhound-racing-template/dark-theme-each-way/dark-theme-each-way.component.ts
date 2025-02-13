import { Component, Input, OnChanges } from '@angular/core';

import { RacingConfiguration } from '../../../../../common/models/racing-configuration/racing-configuration.model';
import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { FlipGoingPostPicStages } from '../../../../../horse-racing/models/common.model';
import { GreyhoundStaticContent } from '../../../../models/greyhound-racing-template.model';

@Component({
    selector: 'gn-dark-theme-each-way',
    templateUrl: './dark-theme-each-way.component.html',
    styleUrls: ['./dark-theme-each-way.component.scss'],
})
export class DarkThemeEachWayComponent implements OnChanges {
    @Input() greyhoundStaticContent: GreyhoundStaticContent;
    @Input() isHalfScreenType: boolean;
    @Input() isFullScreenType: boolean;
    @Input() isEventResulted: boolean;
    // left content
    @Input() runnerCount: string;
    @Input() grade: string;
    @Input() racingDistance: string;

    // center content
    @Input() racingPostTipImage: string;
    @Input() racingPostTipOrder: Array<string> = [];
    @Input() napOrNb: string;
    @Input() isUKEvent: boolean;
    @Input() hasAnyReservedRunner: boolean;
    @Input() raceOffTime: string;
    @Input() vacantRunners: string;
    @Input() foreCastTriCastValue: string;
    @Input() isRaceOff: boolean;

    // right content
    @Input() marketEachWayString: string;
    @Input() isNonRunner: boolean;

    isIntervalSet = false;
    intervalId: NodeJS.Timeout;
    flipTime: number;
    currentItem: string = FlipGoingPostPicStages.RacingPostPic;
    flipStages = FlipGoingPostPicStages;

    constructor(private racingConfigurationService: RacingConfigurationService) {}

    ngOnChanges() {
        this.racingConfigurationService.designConfiguration$.subscribe((raceConfig: RacingConfiguration) => {
            this.flipTime = raceConfig.GoingAndRacingPostPickFlipTime ?? 5000;
            this.initializeRacingPostTipFlip();
        });
    }

    initializeRacingPostTipFlip() {
        this.foreCastTriCastValue && this.racingPostTipOrder?.length && (this.isIntervalSet = false);
        if (
            this.isUKEvent &&
            !this.isIntervalSet &&
            !this.isNonRunner &&
            !this.hasAnyReservedRunner &&
            this.foreCastTriCastValue &&
            this.racingPostTipOrder?.length &&
            !this.isRaceOff
        ) {
            this.startInterval([FlipGoingPostPicStages.RacingPostPic, FlipGoingPostPicStages.FcTcValue]);
            return;
        } else if (!this.isNonRunner && !this.hasAnyReservedRunner && this.racingPostTipOrder?.length && this.isRaceOff) {
            this.currentItem = FlipGoingPostPicStages.RacingPostPic;
        } else if (
            this.isUKEvent &&
            !this.isNonRunner &&
            !this.hasAnyReservedRunner &&
            !this.foreCastTriCastValue &&
            this.racingPostTipOrder?.length
        ) {
            this.currentItem = FlipGoingPostPicStages.RacingPostPic;
        } else if (!this.isNonRunner && this.hasAnyReservedRunner && this.foreCastTriCastValue && this.racingPostTipOrder?.length) {
            this.currentItem = FlipGoingPostPicStages.FcTcValue;
        } else if (
            this.isUKEvent &&
            !this.isIntervalSet &&
            !this.hasAnyReservedRunner &&
            this.foreCastTriCastValue &&
            this.racingPostTipOrder?.length &&
            !this.isRaceOff
        ) {
            this.startInterval([FlipGoingPostPicStages.RacingPostPic, FlipGoingPostPicStages.FcTcValue]);
            return;
        } else if (this.isNonRunner && !this.hasAnyReservedRunner && this.foreCastTriCastValue && this.racingPostTipOrder?.length) {
            this.startInterval([FlipGoingPostPicStages.RacingPostPic, FlipGoingPostPicStages.FcTcValue]);
        } else if (this.foreCastTriCastValue && !this.racingPostTipOrder?.length) {
            this.currentItem = FlipGoingPostPicStages.FcTcValue;
        }

        this.intervalId && clearInterval(this.intervalId);
    }

    private startInterval(stages: string[]) {
        this.isIntervalSet = true;
        clearInterval(this.intervalId);
        let currentIndex = 0;

        this.intervalId = setInterval(() => {
            const nextIndex = (currentIndex + 1) % stages.length;
            this.currentItem = stages[nextIndex];
            currentIndex = nextIndex;
        }, this.flipTime);
    }
}
