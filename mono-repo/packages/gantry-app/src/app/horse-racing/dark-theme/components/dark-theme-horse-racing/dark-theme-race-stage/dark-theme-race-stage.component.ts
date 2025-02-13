import { Component, Input, OnChanges } from '@angular/core';

import { BehaviorSubject, Subscription, interval } from 'rxjs';

import { StringHelper } from '../../../../../common/helpers/string.helper';
import { DarkThemeMarketStatus } from '../../../../../common/models/general-codes-model';
import { RacingConfiguration } from '../../../../../common/models/racing-configuration/racing-configuration.model';
import { RaceStagePipe } from '../../../../../common/pipes/race-stage.pipe';
import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { HorseRacingRunnersResult } from '../../../../models/horse-racing-template.model';

@Component({
    selector: 'gn-dark-theme-race-stage',
    templateUrl: './dark-theme-race-stage.component.html',
    styleUrls: ['./dark-theme-race-stage.component.scss'],
})
export class DarkThemeRaceStageComponent implements OnChanges {
    @Input() horseRacingResult: HorseRacingRunnersResult;
    flipTime: number = 3000;
    isIntervalSet = false;
    livePrice: string;
    raceStage: string;
    raceStageFlipInterval: Subscription;
    isEarlyOrLivePrice = false;
    marketStatus = DarkThemeMarketStatus.Suspended;
    currentStage$ = new BehaviorSubject<string>('');

    constructor(
        private raceStagePipe: RaceStagePipe,
        private racingConfigService: RacingConfigurationService,
    ) {
        this.racingConfigService.designConfiguration$.subscribe((raceConfig: RacingConfiguration) => {
            this.flipTime = raceConfig.RaceStageFlipTime ?? 3000;
        });
    }

    ngOnChanges(): void {
        this.livePrice = this.horseRacingResult?.horseRacingContent?.contentParameters?.LivePrice ?? '';
        this.setInitialCurrentStage();
        this.isEarlyOrLivePrice = StringHelper.updateIsEarlyOrLivePrice(this.currentStage$.value);
        this.raceStageFlip();
    }

    setInitialCurrentStage() {
        this.currentStage$.next(this.horseRacingResult?.defaultPriceColumn);

        if (!this.horseRacingResult?.areCurrentPricesPresent) {
            if (!this.horseRacingResult?.raceStage) {
                this.currentStage$.next(this.horseRacingResult?.horseRacingContent?.contentParameters?.AwaitingPrice ?? '');
            } else if (!!this.horseRacingResult?.raceStage && this.horseRacingResult?.raceStage[0] == 'O') {
                this.currentStage$.next(this.horseRacingResult?.defaultPriceColumn);
                this.clearFlipInterval();
            }
        }
    }

    raceStageFlip() {
        if (this.horseRacingResult?.defaultPriceColumn == this.livePrice && !this.isIntervalSet) {
            this.isIntervalSet = true;
            this.clearFlipInterval();
            this.raceStageFlipInterval = interval(this.flipTime).subscribe(() => {
                const stage = this.currentStage$.value;
                if (stage === this.livePrice) {
                    this.currentStage$.next(
                        this.horseRacingResult?.raceStage
                            ? this.raceStagePipe.transform(
                                  this.horseRacingResult?.raceStage,
                                  this.horseRacingResult?.horseRacingContent?.contentParameters?.ApproachingTraps ?? '',
                              )
                            : stage,
                    );
                    this.isEarlyOrLivePrice = StringHelper.updateIsEarlyOrLivePrice(this.currentStage$.value);
                } else {
                    this.currentStage$.next(this.livePrice);
                    this.isEarlyOrLivePrice = true;
                    if (!!this.horseRacingResult?.raceStage && this.horseRacingResult?.raceStage[0] == 'O') {
                        this.currentStage$.next(this.horseRacingResult?.defaultPriceColumn);
                        this.clearFlipInterval();
                        this.isEarlyOrLivePrice = false; // race stage is off
                    }
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.clearFlipInterval();
    }

    clearFlipInterval() {
        if (this.raceStageFlipInterval) this.raceStageFlipInterval.unsubscribe();
    }
}
