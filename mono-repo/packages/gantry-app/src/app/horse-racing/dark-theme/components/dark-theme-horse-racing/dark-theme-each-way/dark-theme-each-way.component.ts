import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BehaviorSubject, Subscription, interval } from 'rxjs';

import { RacingConfiguration } from '../../../../../common/models/racing-configuration/racing-configuration.model';
import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { FlipGoingPostPicStages } from '../../../../models/common.model';
import { HorseRacingEntry } from '../../../../models/horse-racing-template.model';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';

@Component({
    selector: 'gn-dark-theme-each-way',
    templateUrl: './dark-theme-each-way.component.html',
    styleUrls: ['./dark-theme-each-way.component.scss'],
})
export class DarkThemeEachWayComponent implements OnChanges {
    @Input() runnerCount: string;
    @Input() marketEachWayString: string;
    @Input() isEventResulted: boolean;
    @Input() horseRacingContent: HorseRacingContent;
    @Input() isNonRunner: boolean;
    @Input() raceNo: number;
    @Input() isWithdrawn: boolean;
    @Input() evrRaceType: string;
    @Input() distance: string;
    @Input() going: string;
    @Input() racingPostTipHorseName: string;
    @Input() isHalfScreenType: boolean;
    @Input() FcTcValue: string;
    @Input() isRaceOff: boolean;
    @Input() horseRacingEntries: HorseRacingEntry[];
    @Input() isRCEnabled: boolean = false;
    @Input() rcTemplate: boolean = false;
    @Input() isVirtualRace = false;
    @Input() arePlus1MarketPricesPresent = false;
    isIntervalSet = false;
    goingAndRacingPostPickFlipTime: number = 5000;
    currentItem$ = new BehaviorSubject<string>(FlipGoingPostPicStages.Going);
    flipGoingPostPicStages = FlipGoingPostPicStages;
    flipInterval: Subscription;

    constructor(private racingConfigurationService: RacingConfigurationService) {
        this.racingConfigurationService.designConfiguration$.subscribe((raceConfig: RacingConfiguration) => {
            this.goingAndRacingPostPickFlipTime = raceConfig.GoingAndRacingPostPickFlipTime ?? 5000;
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.rcTemplate && !this.isHalfScreenType) {
            // full,quad
            if (this.arePlus1MarketPricesPresent) {
                this.racingPostTipHorseName = ''; // not display in footer
            } else if (this.horseRacingEntries?.length <= 10 || this.horseRacingEntries?.length > 20) {
                this.racingPostTipHorseName = ''; // not display in footer
            }
        }
        this.goingAndRacingPostFlip();
    }

    resetInterval(showRacingPostTip: boolean) {
        if ((showRacingPostTip && this.FcTcValue) || (this.FcTcValue && this.going) || (this.going && showRacingPostTip)) {
            this.isIntervalSet = false;
        }
    }

    goingAndRacingPostFlip() {
        const showRacingPostTip = !!this.racingPostTipHorseName && !this.isNonRunner && !this.isWithdrawn;
        this.resetInterval(showRacingPostTip);

        if (!this.isIntervalSet && this.isHalfScreenType && showRacingPostTip && this.FcTcValue && this.going && !this.isRaceOff) {
            this.startInterval([FlipGoingPostPicStages.Going, FlipGoingPostPicStages.RacingPostPic, FlipGoingPostPicStages.FcTcValue]);
            return;
        } else if (!this.isIntervalSet && this.isHalfScreenType && showRacingPostTip && !this.FcTcValue && this.going && !this.isRaceOff) {
            this.startInterval([FlipGoingPostPicStages.Going, FlipGoingPostPicStages.RacingPostPic]);
            return;
        } else if (!this.isIntervalSet && this.isHalfScreenType && showRacingPostTip && this.FcTcValue && !this.going && !this.isRaceOff) {
            this.startInterval([FlipGoingPostPicStages.FcTcValue, FlipGoingPostPicStages.RacingPostPic]);
            return;
        } else if (!this.isIntervalSet && this.FcTcValue && this.going && !this.isRaceOff && showRacingPostTip) {
            if (!this.isHalfScreenType && this.isRCEnabled && this.horseRacingEntries?.length > 10) {
                this.startInterval([FlipGoingPostPicStages.Going, FlipGoingPostPicStages.RacingPostPic, FlipGoingPostPicStages.FcTcValue]);
            } else {
                this.startInterval([FlipGoingPostPicStages.Going, FlipGoingPostPicStages.FcTcValue]);
            }
            return;
        } else if (!this.isIntervalSet && this.FcTcValue && this.going && !showRacingPostTip && !this.isRaceOff) {
            this.startInterval([FlipGoingPostPicStages.Going, FlipGoingPostPicStages.FcTcValue]);
            return;
        } else if (showRacingPostTip && !this.FcTcValue && !this.going && !this.isRaceOff) {
            this.currentItem$.next(FlipGoingPostPicStages.RacingPostPic);
        } else if (!this.FcTcValue && this.going && !this.isRaceOff) {
            this.currentItem$.next(FlipGoingPostPicStages.Going);
        } else if (this.FcTcValue && !this.going && !this.isRaceOff) {
            this.currentItem$.next(FlipGoingPostPicStages.FcTcValue);
        } else if (this.going && this.isRaceOff) {
            this.currentItem$.next(FlipGoingPostPicStages.Going);
        }
        this.clearFlipInterval();
    }

    private startInterval(stages: string[]) {
        this.isIntervalSet = true;
        this.clearFlipInterval();
        let currentIndex = 0;

        this.flipInterval = interval(this.goingAndRacingPostPickFlipTime).subscribe(() => {
            const nextIndex = (currentIndex + 1) % stages.length;
            this.currentItem$.next(stages[nextIndex]);
            currentIndex = nextIndex;
        });
    }

    ngOnDestroy(): void {
        this.clearFlipInterval();
    }

    clearFlipInterval() {
        if (this.flipInterval) this.flipInterval.unsubscribe();
    }
}
