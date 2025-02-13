import { Injectable } from '@angular/core';

import { SportCdsTemplateService } from 'packages/gantry-app/src/app/cds/common/services/sport-cds-template.service';
import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookMarketHelper } from '../../../../../common/helpers/sport-book-market.helper';
import { SportBookResultHelper } from '../../../../../common/helpers/sport-book-result.helper';
import { SportBookResult } from '../../../../../common/models/data-feed/sport-bet-models';
import { Markets } from '../../../../../common/models/gantrymarkets.model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../../common/models/query-param.model';
import { BaseRacingTemplateService } from '../../../../../common/services/base-racing-template.service';
import { SportBookService } from '../../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../../common/services/error.service';
import { EvrAvrConfigurationService } from '../../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../../common/services/gantry-markets.service';
import { LoggerService } from '../../../../../common/services/logger.service';
import { RaceOffService } from '../../../../../common/services/race-off.service';
import { ScreenTypeService } from '../../../../../common/services/screen-type.service';
import { GreyhoundRacingContentService } from '../../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import {
    GreyhoundRacingRunnersResult,
    GreyhoundRacingTemplateResult,
    GreyhoundStaticContent,
} from '../../../../models/greyhound-racing-template.model';
import { MaxLimitRunners } from '../../../../models/greyhound-racing.enum';
import { RacingContentGreyhoundResult } from '../../../../models/racing-content.model';
import { RacingContentGreyhoundService } from '../../../../services/data-feed/racing-content-greyhound.service';
import { DarkThemeGreyhoundRacingResultService } from '../dark-theme-result/services/dark-theme-greyhound-racing-result.service';
import { DarkThemeGreyhoundRacingRunnersService } from '../dark-theme-runners/services/dark-theme-greyhound-racing-runners.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeGreyhoundRacingTemplateService extends BaseRacingTemplateService {
    private countryFlags: string;
    isVirtualRaceFlag: boolean;

    errorMessage$ = this.errorService.errorMessage$;

    greyHoundData$ = this.greyhoundRacingContentService.data$.pipe(
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    racingContent$ = this.racingContentGreyhoundService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    sportBookEvents$ = this.sportBookService.data$.pipe(
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    gantryMarkets$ = this.sportCdsTemplateService.getGantryMarketDataContent();

    data$ = combineLatest([
        this.sportBookEvents$,
        this.racingContent$,
        this.greyHoundData$,
        this.raceOffService.isRaceOff$,
        this.gantryMarkets$,
    ]).pipe(
        map(([sportBookResult, racingContent, greyHoundData, isRaceOff, gantryMarkets]) => {
            let greyhoundRacingTemplateResult: GreyhoundRacingTemplateResult = new GreyhoundRacingTemplateResult();
            try {
                SportBookResultHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult);

                if (!this.countryFlags) {
                    this.countryFlags = super.getFlag(sportBookResult);
                    if (this.countryFlags) {
                        this.greyhoundRacingContentService.setCountry(this.countryFlags);
                    }
                }
                const event = [...sportBookResult.events.values()][0];
                this.isVirtualRaceFlag = super.isEventVirtualRace(event?.typeFlagCode);

                this.racingContentGreyhoundService.setIsVirtual(this.isVirtualRaceFlag);
                this.darkThemeGreyhoundRacingResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
                this.darkThemeGreyhoundRacingResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
                this.darkThemeGreyhoundRacingResultService.meetingName = event?.typeName?.trim()?.toUpperCase();
                greyhoundRacingTemplateResult = this.prepareResult(
                    sportBookResult,
                    racingContent,
                    greyHoundData as GreyhoundStaticContent,
                    gantryMarkets,
                );

                if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isRaceOff = isRaceOff;
                    const runnerCount = greyhoundRacingTemplateResult.greyhoundRacingRunnersResult?.runnerCount
                        ? parseInt(greyhoundRacingTemplateResult.greyhoundRacingRunnersResult?.runnerCount)
                        : '';
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.foreCastTriCastValue = this.getFcTcType(
                        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult,
                        runnerCount,
                    );
                }
            } catch (error) {
                this.loggerService.logError(error);
            }
            return greyhoundRacingTemplateResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        gantryCommonContentService: GantryCommonContentService,
        evrAvrConfigurationService: EvrAvrConfigurationService,
        raceOffService: RaceOffService,
        gantryMarketsService: GantryMarketsService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportBookService: SportBookService,
        private racingContentGreyhoundService: RacingContentGreyhoundService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private screenTypeService: ScreenTypeService,
        private sportCdsTemplateService: SportCdsTemplateService,
        private darkThemeGreyhoundRacingRunnersService: DarkThemeGreyhoundRacingRunnersService,
        private darkThemeGreyhoundRacingResultService: DarkThemeGreyhoundRacingResultService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    getFcTcType(greyhoundRacingRunnersResult: any, runnerCount: any) {
        const winOrEachWayMarket = greyhoundRacingRunnersResult?.markets[0];
        const runnerCountMaxLimit = greyhoundRacingRunnersResult?.isEventPGRTrack ? MaxLimitRunners.PGRTracks : MaxLimitRunners.NonPGRTracks;
        return SportBookMarketHelper.getFcTcValue(
            winOrEachWayMarket?.isForecastMarket,
            winOrEachWayMarket?.isTricastMarket,
            runnerCount,
            runnerCountMaxLimit,
        );
    }

    setEventKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        const queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.sportBookService.setMarketException(true);
        this.sportBookService.setRemoveSuspendedSelections(false);
        this.racingContentGreyhoundService.setEvent(new QueryParamEvent(eventKey));
        this.darkThemeGreyhoundRacingResultService.setEventId(new QueryParamEvent(eventKey));
    }

    prepareResult(
        sportBookResult: SportBookResult,
        racingContent: RacingContentGreyhoundResult,
        greyHoundStaticContent: GreyhoundStaticContent,
        gantryMarkets: Array<Markets>,
    ) {
        const isEventResulted: boolean = super.isEventResulted(sportBookResult);
        const event = [...sportBookResult.events.values()][0]; //Fetching event
        const isEvrRaceCheck: boolean = super.isEvrRaceCheck();
        //below line is making an API call to get to know event is EVR or not.
        super.setEvrAvrRaceCheck(event?.typeKey);
        if (super.isEvrRaceCheck()) {
            if (!event.offTime) {
                super.setEvrOffPageDelay();
            }
        }

        const greyhoundRacingTemplateResult = new GreyhoundRacingTemplateResult();
        greyhoundRacingTemplateResult.isAnyEventResulted = isEventResulted;
        if (!isEventResulted) {
            greyhoundRacingTemplateResult.greyhoundRacingRunnersResult =
                this.darkThemeGreyhoundRacingRunnersService.createGreyhoundRacingRunnersResult(
                    sportBookResult,
                    racingContent,
                    greyHoundStaticContent,
                    this.countryFlags,
                    gantryMarkets,
                );

            if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isEvrRace = isEvrRaceCheck;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isHalfScreenType = this.screenTypeService.isHalfScreenType;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isFullScreenType = this.screenTypeService.isFullScreenType;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.marketSelectionPresent = this.getMarketSelectionPresent(
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult,
                );
            }
        }

        return greyhoundRacingTemplateResult;
    }

    setIsHalfScreenType(ghrTemplateResult: GreyhoundRacingTemplateResult) {
        if (ghrTemplateResult?.greyhoundRacingRunnersResult) {
            ghrTemplateResult.greyhoundRacingRunnersResult.isFullScreenType = this.screenTypeService.isFullScreenType;
        }
    }

    canShowBannerPostPick(ghrRunningResult: GreyhoundRacingRunnersResult) {
        return (
            (!ghrRunningResult?.areCurrentPricesPresent &&
                !!ghrRunningResult.racingContent?.runners &&
                ghrRunningResult.racingContent?.runners?.length > 0) ||
            (!!ghrRunningResult?.featureMarketList && ghrRunningResult?.featureMarketList?.length > 0)
        );
    }

    canShowFlexScreen(ghrRunningResult: GreyhoundRacingRunnersResult) {
        return (
            this.screenTypeService.isFullScreenType &&
            (ghrRunningResult.featureMarketList?.length ||
                (!ghrRunningResult.areCurrentPricesPresent && ghrRunningResult.racingContent?.runners?.length))
        );
    }

    getMarketSelectionPresent(ghrRunningResult: GreyhoundRacingRunnersResult) {
        return this.screenTypeService.isFullScreenType && ghrRunningResult.featureMarketList?.length;
    }

    canShowForm(ghrRunningResult: GreyhoundRacingRunnersResult) {
        return (
            this.screenTypeService.isFullScreenType && !ghrRunningResult.areCurrentPricesPresent && ghrRunningResult.racingContent?.runners?.length
        );
    }
}
