import { Injectable } from '@angular/core';

import { SportCdsTemplateService } from 'packages/gantry-app/src/app/cds/common/services/sport-cds-template.service';
import { BehaviorSubject, EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookResultHelper } from '../../../../common/helpers/sport-book-result.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { SportBookResult } from '../../../../common/models/data-feed/sport-bet-models';
import { VirtualRaceSilkRunnerImageContent } from '../../../../common/models/gantry-commom-content.model';
import { Markets } from '../../../../common/models/gantrymarkets.model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { BaseRacingTemplateService } from '../../../../common/services/base-racing-template.service';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { EvrAvrConfigurationService } from '../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { LoggerService } from '../../../../common/services/logger.service';
import { RaceOffService } from '../../../../common/services/race-off.service';
import { ScreenTypeService } from '../../../../common/services/screen-type.service';
import { VirtualRaceImageService } from '../../../../common/services/virtual-race-image.service';
import {
    GreyhoundRacingRunnersResult,
    GreyhoundRacingTemplateResult,
    GreyhoundStaticContent,
    RunnerImages,
} from '../../../models/greyhound-racing-template.model';
import { RacingContentGreyhoundResult } from '../../../models/racing-content.model';
import { RacingContentGreyhoundService } from '../../../services/data-feed/racing-content-greyhound.service';
import { GreyhoundRacingResultService } from '../result/services/greyhound-racing-result.service';
import { GreyhoundRacingRunnersService } from '../runners/services/greyhound-racing-runners.service';
import { GreyhoundRacingContentService } from './greyhound-racing-content.service';

@Injectable({
    providedIn: 'root',
})
export class GreyhoundRacingTemplateService extends BaseRacingTemplateService {
    private countryFlags: string;
    private meetingList: Array<string> = [];
    private virtualRaceSubject = new BehaviorSubject<RunnerImages>(new RunnerImages());
    isVirtualRaceFlag: boolean;

    errorMessage$ = this.errorService.errorMessage$;

    greyHoundData$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyHoundData: GreyhoundStaticContent) => {
            console.log(greyHoundData);
        }),
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

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        startWith({} as VirtualRaceSilkRunnerImageContent), // Initial Value
    );

    gantryMarkets$ = this.sportCdsTemplateService.getGantryMarketDataContent();

    data$ = combineLatest([
        this.sportBookEvents$,
        this.racingContent$,
        this.greyHoundData$,
        this.virtualRaceImageService$,
        this.raceOffService.isRaceOff$,
        this.gantryMarkets$,
    ]).pipe(
        map(([sportBookResult, racingContent, greyHoundData, virtualRaceImageContent, isRaceOff, gantryMarkets]) => {
            let greyhoundRacingTemplateResult: GreyhoundRacingTemplateResult = new GreyhoundRacingTemplateResult();
            try {
                SportBookResultHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult);

                if (!this.countryFlags) {
                    this.countryFlags = super.getFlag(sportBookResult);
                    if (this.countryFlags) {
                        this.greyhoundRacingContentService.setCountry(this.countryFlags);
                    }
                }

                this.isVirtualRaceFlag = super.isEventVirtualRace([...sportBookResult.events.values()][0]?.typeFlagCode);
                this.racingContentGreyhoundService.setIsVirtual(this.isVirtualRaceFlag);
                this.greyhoundRacingResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
                this.greyhoundRacingResultService.meetingName = [...sportBookResult.events.values()][0]?.typeName?.trim()?.toUpperCase();
                if (this.isVirtualRaceFlag && !!virtualRaceImageContent) {
                    greyHoundData.greyHoundImages = virtualRaceImageContent;
                }
                greyhoundRacingTemplateResult = this.prepareResult(sportBookResult, racingContent, greyHoundData, gantryMarkets);

                if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isRaceOff = isRaceOff;
                }
            } catch (error) {
                console.log(error);
                this.loggerService.logError(error);
            }
            return greyhoundRacingTemplateResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private sportBookService: SportBookService,
        private racingContentGreyhoundService: RacingContentGreyhoundService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private greyhoundRacingRunnersService: GreyhoundRacingRunnersService,
        private greyhoundRacingResultService: GreyhoundRacingResultService,
        gantryCommonContentService: GantryCommonContentService,
        private errorService: ErrorService,
        private virtualRaceImageService: VirtualRaceImageService,
        private screenTypeService: ScreenTypeService,
        public override gantryMarketsService: GantryMarketsService,
        evrAvrConfigurationService: EvrAvrConfigurationService,
        public override raceOffService: RaceOffService,
        private loggerService: LoggerService,
        private sportCdsTemplateService: SportCdsTemplateService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    setEventKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        const queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.sportBookService.setMarketException(true);
        this.sportBookService.setRemoveSuspendedSelections(false);
        this.racingContentGreyhoundService.setEvent(new QueryParamEvent(eventKey));
        this.greyhoundRacingResultService.setEventId(new QueryParamEvent(eventKey));
    }

    prepareResult(
        sportBookResult: SportBookResult,
        racingContent: RacingContentGreyhoundResult,
        greyHoundImageData: GreyhoundStaticContent,
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
            if (this.isVirtualRaceFlag) {
                const meetingName = event?.typeName?.trim()?.toUpperCase();
                const eventName = StringHelper.removeTimeInEventName(event?.eventName);
                if (!this.meetingList?.includes(meetingName)) {
                    this.meetingList.push(meetingName);
                    this.virtualRaceImageService.setEventAndMeetingName('1', meetingName, eventName);
                    this.virtualRaceImageService$.subscribe((runnerImageContent) => {
                        this.virtualRaceSubject.next(runnerImageContent);
                    });
                }
            }
            greyhoundRacingTemplateResult.greyhoundRacingRunnersResult = this.greyhoundRacingRunnersService.createGreyhoundRacingRunnersResult(
                sportBookResult,
                racingContent,
                greyHoundImageData,
                this.countryFlags,
                gantryMarkets,
            );
            if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isEvrRace = isEvrRaceCheck;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isHalfScreenType = this.screenTypeService.isHalfScreenType;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isFullScreenType = this.screenTypeService.isFullScreenType;
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showBannerPostPick = this.canShowBannerPostPick(
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult,
                );
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showFlexScreen = this.canShowFlexScreen(
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult,
                );
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.marketSelectionPresent = this.getMarketSelectionPresent(
                    greyhoundRacingTemplateResult.greyhoundRacingRunnersResult,
                );
                greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showForm = this.canShowForm(
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
            (!!ghrRunningResult.featureMarketList && ghrRunningResult.featureMarketList?.length > 0)
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
