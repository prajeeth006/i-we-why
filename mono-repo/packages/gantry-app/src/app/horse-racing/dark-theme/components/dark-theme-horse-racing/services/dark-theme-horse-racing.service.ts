import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookResultHelper } from '../../../../../common/helpers/sport-book-result.helper';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { SportBookResult } from '../../../../../common/models/data-feed/sport-bet-models';
import { CheckEvrAvrByTypeId } from '../../../../../common/models/evr-avr-configuration.model';
import { VirtualRaceSilkRunnerImageContent } from '../../../../../common/models/gantry-commom-content.model';
import { EventStatusType } from '../../../../../common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../../common/models/query-param.model';
import { RacingConfiguration } from '../../../../../common/models/racing-configuration/racing-configuration.model';
import { BaseRacingTemplateService } from '../../../../../common/services/base-racing-template.service';
import { SportBookService } from '../../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../../common/services/error.service';
import { EvrAvrConfigurationService } from '../../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../../common/services/gantry-markets.service';
import { LoggerService } from '../../../../../common/services/logger.service';
import { RaceOffService } from '../../../../../common/services/race-off.service';
import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { ScreenTypeService } from '../../../../../common/services/screen-type.service';
import { VirtualRaceImageService } from '../../../../../common/services/virtual-race-image.service';
import { ForecastTricastType } from '../../../../models/common.model';
import { RacingContentResult } from '../../../../models/data-feed/racing-content.model';
import { ImageStatus } from '../../../../models/fallback-src.constant';
import { HorseRacingRunnersResult, HorseRacingTemplateResult, RunnerImages } from '../../../../models/horse-racing-template.model';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';
import { RacingContentService } from '../../../../services/data-feed/racing-content.service';
import { HorseRacingContentService } from '../../../../services/horseracing-content.service';
import { DarkThemeResultService } from '../dark-theme-result/services/dark-theme-result.service';
import { DarkThemeRunnersService } from '../dark-theme-runners/services/dark-theme-runners.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeHorseRacingService extends BaseRacingTemplateService {
    private meetingList: Array<string> = [];
    isVirtualRaceFlag: boolean;
    isStop: boolean = true;
    // isScrollingAsset: boolean = false;
    isRacingPostVerdictCountries: boolean = false;
    diomedSelectionName: string | undefined = '';
    isDiomedPresent: boolean = false;
    private virtualRaceSubject = new BehaviorSubject<RunnerImages>(new RunnerImages());

    errorMessage$ = this.errorService.errorMessage$;

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

    racingContent$ = this.racingContentService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        startWith({} as HorseRacingContent), // Initial value
    );

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        startWith({} as VirtualRaceSilkRunnerImageContent), // Initial Value
    );

    data$ = combineLatest([
        this.sportBookEvents$, // DF team
        this.racingContent$, // DF team
        this.horseRacingContent$, // sitecore
        this.virtualRaceImageService$, // AWS 
        this.raceOffService.isRaceOff$, // code
        this.evrAvrConfigurationService.evrAvrRace$, // code
        this.racingConfigurationService.designConfiguration$, // sitecore
    ]).pipe(
        map(([sportBookResult, racingContent, horseRacingContent, virtualRaceImageContent, isRaceOff, isEvrAvrRace, runnerCountConfig]) => {
            let horseRacingTemplateResult: HorseRacingTemplateResult = new HorseRacingTemplateResult();
            try {
                SportBookResultHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult);
                this.darkThemeResultService.meetingName =
                    sportBookResult.events.size > 0 ? ([...sportBookResult.events.values()][0]?.typeName?.trim()?.toUpperCase() ?? '') : '';
                this.isVirtualRaceFlag = super.isEventVirtualRace(
                    sportBookResult.events.size > 0 ? ([...sportBookResult.events.values()][0]?.typeFlagCode ?? '') : '',
                );
                this.isRacingPostVerdictCountries = this.racingPostVerdictCountries(
                    [...sportBookResult.events.values()][0]?.typeFlagCode,
                    horseRacingContent,
                );
                this.diomedSelectionName = this.darkThemeRunnersService?.diomedSelectionName;
                this.isDiomedPresent = this.darkThemeRunnersService?.isDiomedPresent;
                this.racingContentService.setIsVirtual(this.isVirtualRaceFlag);
                this.darkThemeResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
                this.darkThemeRunnersService.isVirtualRaceFlag = this.isVirtualRaceFlag;
                // this.darkThemeRunnersService.isScrollingAsset = this.isScrollingAsset;
                if (this.isVirtualRaceFlag && !!virtualRaceImageContent) {
                    this.darkThemeRunnersService.virtualRaceSilkImage = virtualRaceImageContent;
                }
                horseRacingTemplateResult = this.prepareResult(sportBookResult, racingContent, horseRacingContent, isEvrAvrRace, runnerCountConfig);
                if (horseRacingTemplateResult?.horseRacingRunnersResult) {
                    horseRacingTemplateResult.horseRacingRunnersResult.isRaceOff = isRaceOff;
                }

                if (racingContent?.hasRacingContent !== undefined && !racingContent?.hasRacingContent) {
                    horseRacingTemplateResult.horseRacingRunnersResult.horseRacingEntries.map((horseRacingEntry) => {
                        if (horseRacingEntry.jockeySilkImage === ImageStatus.Default) {
                            horseRacingEntry.jockeySilkImage = ImageStatus.ImageNotPresent;
                        }
                    });
                }

                const runnerCount = horseRacingTemplateResult.horseRacingRunnersResult?.runnerCount
                    ? parseInt(horseRacingTemplateResult.horseRacingRunnersResult?.runnerCount)
                    : '';
                horseRacingTemplateResult.horseRacingRunnersResult.forecastTricastValue = this.getFcTcType(
                    horseRacingTemplateResult.horseRacingRunnersResult.markets[0],
                    runnerCount,
                );
            } catch (error) {
                console.log(error);
                this.loggerService.logError(error);
            }
            return horseRacingTemplateResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private sportBookService: SportBookService,
        private racingContentService: RacingContentService,
        private horseRacingContent: HorseRacingContentService,
        private darkThemeResultService: DarkThemeResultService,
        private darkThemeRunnersService: DarkThemeRunnersService,
        gantryCommonContentService: GantryCommonContentService,
        private errorService: ErrorService,
        private virtualRaceImageService: VirtualRaceImageService,
        private screenTypeService: ScreenTypeService,
        public override evrAvrConfigurationService: EvrAvrConfigurationService,
        public override raceOffService: RaceOffService,
        public override gantryMarketsService: GantryMarketsService,
        private loggerService: LoggerService,
        private racingConfigurationService: RacingConfigurationService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    public setEvenKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        const queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));

        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.racingContentService.setEvent(new QueryParamEvent(eventKey));
        this.darkThemeResultService.setEventId(eventKey);
        this.sportBookService.setMarketException(true);
        this.sportBookService.setRemoveSuspendedSelections(false);
    }

    private prepareResult(
        sportBookResult: SportBookResult,
        racingContent: RacingContentResult,
        horseRacingContent: HorseRacingContent,
        isEvrAvrRace: CheckEvrAvrByTypeId,
        runnerCountConfig: RacingConfiguration,
    ) {
        const isEventResulted: boolean = super.isEventResulted(sportBookResult);
        const isEvrRaceCheck: boolean = isEvrAvrRace.isEvrRace;
        const isAvrRaceCheck: boolean = isEvrAvrRace.isAvrRace;

        const event = [...sportBookResult.events.values()][0];
        //below line is making an API call to get to know event is EVR or not.
        super.setEvrAvrRaceCheck(event.typeKey ?? '');
        if (super.isEvrRaceCheck()) {
            if (!event.offTime) {
                super.setEvrOffPageDelay();
            }
        }
        const horseRacingTemplateResult = new HorseRacingTemplateResult();
        horseRacingTemplateResult.isAnyEventResulted = isEventResulted;
        if (this.isVirtualRaceFlag) {
            const meetingName = event?.typeName?.trim()?.toUpperCase();
            const eventName = event.eventName ? StringHelper.removeTimeInEventName(event.eventName) : '';
            if (!this.meetingList?.includes(meetingName ?? '')) {
                if (meetingName) {
                    this.meetingList.push(meetingName);
                    this.virtualRaceImageService.setEventAndMeetingName('0', meetingName, eventName);
                }
                this.virtualRaceImageService$.subscribe((runnerImageContent) => {
                    this.virtualRaceSubject.next(runnerImageContent);
                });
            }
        }
        horseRacingTemplateResult.horseRacingRunnersResult = this.darkThemeRunnersService.createHorseRacingRunnersResult(
            sportBookResult,
            racingContent,
            horseRacingContent,
        );
        horseRacingTemplateResult.horseRacingRunnersResult.runnerConfig = runnerCountConfig.runnerCountConfig;
        horseRacingTemplateResult.horseRacingRunnersResult.splitScreenRunnerConfig = runnerCountConfig.splitScreenConfig;

        if (horseRacingTemplateResult?.horseRacingRunnersResult) {
            horseRacingTemplateResult.horseRacingRunnersResult.isEvrRace = isEvrRaceCheck;
            horseRacingTemplateResult.horseRacingRunnersResult.isAvrRace = isAvrRaceCheck;
            horseRacingTemplateResult.horseRacingRunnersResult.isHalfScreenType = this.screenTypeService.isHalfScreenType;
            horseRacingTemplateResult.horseRacingRunnersResult.showBackPrice = this.canShowBackPrice(
                horseRacingTemplateResult?.horseRacingRunnersResult,
            );
            horseRacingTemplateResult.horseRacingRunnersResult.isInternationalRace = StringHelper.isInternationalRace(
                horseRacingTemplateResult.horseRacingRunnersResult.typeFlagCode ?? '',
            );
            horseRacingTemplateResult.horseRacingRunnersResult.showPostPick = this.canShowPostPick(
                horseRacingTemplateResult?.horseRacingRunnersResult,
            );
        }
        if (isEvrRaceCheck) {
            horseRacingTemplateResult.horseRacingRunnersResult.racingContent = this.getRaceTypeAndDistance(
                horseRacingTemplateResult.horseRacingRunnersResult.racingContent,
                horseRacingContent,
                event.typeKey ?? '',
            );
        } else {
            racingContent.distance = this.formatDistanceInfo(
                racingContent.flatOrJump,
                racingContent.raceType,
                racingContent.distance,
                horseRacingContent,
            );
        }
        horseRacingTemplateResult.isAnyEventResulted = this.isEventResultedBasedOnEventStatus(sportBookResult, racingContent);
        return horseRacingTemplateResult;
    }

    canShowBackPrice(hrsRunningResult: HorseRacingRunnersResult) {
        return !this.screenTypeService?.isHalfScreenType || (this.screenTypeService?.isHalfScreenType && hrsRunningResult?.markets?.length < 3);
    }
    canShowPostPick(hrsRunningResult: HorseRacingRunnersResult) {
        return this.screenTypeService.isHalfScreenType && !hrsRunningResult.isInternationalRace && !hrsRunningResult.isVirtualEvent;
    }

    getRaceTypeAndDistance(racingContent: RacingContentResult, horseRacingContent: HorseRacingContent, typeId: string): RacingContentResult {
        const racetypeAndDistance = horseRacingContent?.contentParameters?.[typeId]?.split('|') ?? [];
        if (!!racetypeAndDistance && racetypeAndDistance?.length > 0) {
            racingContent.distance = racetypeAndDistance[0];
            racingContent.evrRaceType = racetypeAndDistance[1];
        }
        return racingContent;
    }

    isEventResultedBasedOnEventStatus(sportBookResult: SportBookResult, racingContent: RacingContentResult): boolean {
        return (
            super.isEventResulted(sportBookResult) ||
            racingContent?.sisData?.eventStatusCode?.toUpperCase() === EventStatusType.photo ||
            racingContent?.sisData?.eventStatusCode?.toUpperCase() === EventStatusType.void
        );
    }

    getFcTcType(data: any, runnerCount: any) {
        const isTricastMarket = StringHelper.toBoolean(data?.isTricastMarket);
        const isForecastMarket = StringHelper.toBoolean(data?.isForecastMarket);
        if (isTricastMarket && isForecastMarket && runnerCount >= 6) {
            if (runnerCount >= 6) return ForecastTricastType.forecastandtricast;
            else if (runnerCount >= 3 && runnerCount < 6) return ForecastTricastType.forecast;
        } else if (isTricastMarket && runnerCount >= 6) {
            return ForecastTricastType.tricast;
        } else if (isForecastMarket && runnerCount >= 3) {
            return ForecastTricastType.forecast;
        }
        return '';
    }

    racingPostVerdictCountries(flags?: string, horseRacingContent?: HorseRacingContent) {
        const countries =
            horseRacingContent?.contentParameters?.RacingPostVerdictCountries?.toUpperCase()
                .split(',')
                .map((country) => country.trim()) ?? [];
        return countries.some((country) => flags?.toUpperCase().includes(country));
    }

    private getRaceTypeInfo(raceType: string, raceTypeMappings: { [key: string]: string }): string {
        if (raceTypeMappings[raceType]) {
            return raceTypeMappings[raceType];
        }
        for (const [key, value] of Object.entries(raceTypeMappings)) {
            if (raceType.includes(key)) {
                return value;
            }
        }
        return raceType;
    }

    formatDistanceInfo(
        flatOrJump: string | null | undefined,
        raceType: string | null | undefined,
        raceDistance: string | null | undefined,
        horseRacingContent: HorseRacingContent,
    ): string {
        try {
            if (horseRacingContent?.contentParameters?.RaceTypes) {
                let distanceAndRaceType = raceDistance ? raceDistance : '';
                let raceTypeMappings: { [key: string]: string } = {};
                try {
                    raceTypeMappings = JSON.parse(horseRacingContent.contentParameters.RaceTypes);
                } catch (error) {
                    this.loggerService.logError(error);
                    return distanceAndRaceType.trim();
                }
                const flatPart = horseRacingContent?.contentParameters?.RaceTypeF?.toUpperCase();
                const jumpPart = horseRacingContent?.contentParameters?.RaceTypeJ?.toUpperCase();
                const RaceTypeFlat = horseRacingContent?.contentParameters?.RaceTypeFlat;
                const flatOrJumpUpper = flatOrJump ? flatOrJump.toUpperCase() : '';
                if (flatOrJumpUpper === flatPart) {
                    if (!distanceAndRaceType.includes(RaceTypeFlat)) {
                        distanceAndRaceType += ` ${RaceTypeFlat}`;
                    }
                } else if (flatOrJumpUpper === jumpPart && raceType) {
                    const raceTypeDescription = this.getRaceTypeInfo(raceType, raceTypeMappings);

                    if (!distanceAndRaceType.includes(raceTypeDescription)) {
                        distanceAndRaceType += ` ${raceTypeDescription}`;
                    }
                } else if (raceDistance && raceType) {
                    const raceTypeDescription = this.getRaceTypeInfo(raceType, raceTypeMappings);
                    if (!distanceAndRaceType.includes(raceTypeDescription)) {
                        distanceAndRaceType += ` ${raceTypeDescription}`;
                    }
                } else if (!raceDistance && raceType) {
                    distanceAndRaceType = this.getRaceTypeInfo(raceType, raceTypeMappings);
                }
                return distanceAndRaceType.trim();
            } else {
                return '';
            }
        } catch (error) {
            this.loggerService.logError(error);
            return '';
        }
    }
}
