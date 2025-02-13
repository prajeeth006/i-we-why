import { Component, Input, OnChanges } from '@angular/core';

import { StringHelper } from '../../../../../common/helpers/string.helper';
import { DarkThemeMarketStatus } from '../../../../../common/models/general-codes-model';
import { RacingConfiguration } from '../../../../../common/models/racing-configuration/racing-configuration.model';
import { RaceStagePipe } from '../../../../../common/pipes/race-stage.pipe';
import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { GreyhoundRacingRunnersResult } from '../../../../models/greyhound-racing-template.model';

@Component({
    selector: 'gn-dark-theme-race-stage',
    templateUrl: './dark-theme-race-stage.component.html',
    styleUrls: ['./dark-theme-race-stage.component.scss'],
})
export class DarkThemeRaceStageComponent implements OnChanges {
    @Input() greyhoundRacingRunnersResult: GreyhoundRacingRunnersResult;

    flipTime: number;
    isIntervalSet = false;
    intervalId: NodeJS.Timeout | string | number | undefined;
    livePrice: string;
    currentStage: string;
    raceStage: string;
    isEarlyOrLivePrice = false;
    suspendedMarketStatus = DarkThemeMarketStatus.Suspended;

    constructor(
        private raceStagePipe: RaceStagePipe,
        private racingConfigService: RacingConfigurationService,
    ) {}

    ngOnChanges(): void {
        this.livePrice = this.greyhoundRacingRunnersResult?.greyHoundImageData?.contentParameters?.LivePrice ?? '';
        this.setInitialCurrentStage();
        this.isEarlyOrLivePrice = StringHelper.updateIsEarlyOrLivePrice(this.currentStage);
        this.racingConfigService.designConfiguration$.subscribe((raceConfig: RacingConfiguration) => {
            this.flipTime = raceConfig.RaceStageFlipTime ?? 3000;
            this.raceStageFlip();
        });
    }

    setInitialCurrentStage() {
        this.currentStage = this.greyhoundRacingRunnersResult?.defaultPriceColumn ?? '';
        if (!this.greyhoundRacingRunnersResult?.areCurrentPricesPresent) {
            if (!this.greyhoundRacingRunnersResult?.raceStage) {
                this.currentStage = this.greyhoundRacingRunnersResult?.greyHoundImageData?.contentParameters?.AwaitingPrice ?? '';
            } else if (!!this.greyhoundRacingRunnersResult?.raceStage && this.greyhoundRacingRunnersResult?.raceStage[0] == 'O') {
                this.currentStage = this.greyhoundRacingRunnersResult?.defaultPriceColumn ?? '';
                this.intervalId && clearInterval(this.intervalId);
            }
        }
    }

    raceStageFlip() {
        if (this.greyhoundRacingRunnersResult?.defaultPriceColumn == this.livePrice && !this.isIntervalSet) {
            this.isIntervalSet = true;
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                if (this.currentStage === this.livePrice) {
                    this.currentStage = this.greyhoundRacingRunnersResult?.raceStage
                        ? this.raceStagePipe.transform(
                              this.greyhoundRacingRunnersResult?.raceStage,
                              this.greyhoundRacingRunnersResult?.greyHoundImageData?.contentParameters?.NewDesignApproachingTraps ?? '',
                          )
                        : this.currentStage;
                    this.isEarlyOrLivePrice = StringHelper.updateIsEarlyOrLivePrice(this.currentStage);
                } else {
                    this.currentStage = this.livePrice;
                    this.isEarlyOrLivePrice = true;

                    if (!!this.greyhoundRacingRunnersResult?.raceStage && this.greyhoundRacingRunnersResult?.raceStage[0] == 'O') {
                        this.currentStage = this.greyhoundRacingRunnersResult?.defaultPriceColumn ?? '';
                        this.intervalId && clearInterval(this.intervalId);
                        this.isEarlyOrLivePrice = false; // race stage is off
                    }
                }
            }, this.flipTime);
        }
    }
}
