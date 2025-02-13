import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { JsonStringifyHelper } from '../../../../../common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from '../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { GantryCommonContent } from '../../../../../common/models/gantry-commom-content.model';
import { PriceType, SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../../common/services/error.service';
import { GantryCommonContentService } from '../../../../../common/services/gantry-common-content.service';
import { Log, LogType, LoggerService } from '../../../../../common/services/logger.service';
import { ScreenTypeService } from '../../../../../common/services/screen-type.service';
import { SignalrService } from '../../../../../common/signalRService/signalr.service';
import { GreyhoundRacingContentService } from '../../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundRacingMarkets } from '../../../../models/common.model';
import {
    ManualGreyhoundRacingEntry,
    ManualGreyhoundRacingResponse,
    ManualGreyhoundRacingResultDetails,
    ManualGreyhoundRacingResults,
    ManualGreyhoundRacingRunners,
    ManualGreyhoundRacingTemplateResult,
    RacingContentData,
    Runner,
} from '../../../../models/greyhound-racing-manual-template.model';
import { GreyhoundStaticContent } from '../../../../models/greyhound-racing-template.model';
import { TypeFlagCode } from '../../../../models/greyhound-racing.enum';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeManualGreyhoundRacingTemplateService {
    countryFlag: string | null | undefined;
    gantryCommonContent: GantryCommonContent;
    errorMessage$ = this.errorService.errorMessage$;
    racingContentBehaviourSubject$ = new BehaviorSubject<ManualGreyhoundRacingTemplateResult>(new ManualGreyhoundRacingTemplateResult());
    runners: Runner[] = [];

    constructor(
        private errorService: ErrorService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        public screenTypeService: ScreenTypeService,
        private gantryCommonContentService: GantryCommonContentService,
        private signalrService: SignalrService,
        public loggerService: LoggerService,
    ) {
        this.gantryCommonContent$.subscribe((content: GantryCommonContent) => {
            this.gantryCommonContent = content;
        });
        this.subscribeToSignalR();
    }

    gantryCommonContent$ = this.gantryCommonContentService.data$.pipe(
        tap((gantryCommonContent: GantryCommonContent) => {
            JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as GantryCommonContent), // Initial Value
    );

    greyhoundRacingContent$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyhoundRacingContent: GreyhoundStaticContent) => {
            console.log(greyhoundRacingContent);
        }),
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    racingContent$: Observable<ManualGreyhoundRacingTemplateResult> = this.racingContentBehaviourSubject$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    data$ = combineLatest(this.greyhoundRacingContent$, this.racingContent$, this.gantryCommonContent$).pipe(
        map(([greyhoundRacingContent, racingContent, gantryCommonContent]) => {
            const manualGreyhoundRacingTemplateData = new ManualGreyhoundRacingResponse();
            try {
                manualGreyhoundRacingTemplateData.isAnyEventResulted = racingContent?.isEventResulted;

                if (!this.countryFlag) {
                    this.countryFlag =
                        racingContent?.country?.toUpperCase() == TypeFlagCode.Australia || racingContent?.country?.toUpperCase() == TypeFlagCode.Aus
                            ? TypeFlagCode.Aus
                            : undefined;
                    if (this.countryFlag) {
                        this.greyhoundRacingContentService.setCountry(this.countryFlag);
                    }
                }

                if (!racingContent?.isEventResulted) {
                    manualGreyhoundRacingTemplateData.manualGreyhoundRacingRunners = this.prepareRunnersContent(
                        greyhoundRacingContent,
                        racingContent,
                        gantryCommonContent,
                    );
                } else {
                    this.runners = racingContent.Runners;
                    manualGreyhoundRacingTemplateData.manualGreyhoundRacingResults = this.prepareResultContent(
                        greyhoundRacingContent,
                        racingContent,
                        gantryCommonContent,
                    );
                }
            } catch (e) {
                this.signalrService.setSignalRErrorStatus(e.stack);
                this.log(`Error in processing ManualGreyhoundRacingResponse ${e}`, LogType.Error, 'NA', true);
            }
            return manualGreyhoundRacingTemplateData;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    public setEachWay(eachWay: string): string {
        const eachWayPositions = eachWay?.trim()?.split(' ');

        if ((!!eachWayPositions && (eachWayPositions[2] === '1/1' || eachWay?.toLocaleUpperCase() === GreyhoundRacingMarkets.WinOnly)) || !eachWay) {
            return GreyhoundRacingMarkets.WinOnly;
        }

        if (eachWayPositions?.length == 4) {
            const eachWayStr = eachWayPositions[2] + ' ' + eachWayPositions[3] + ' ' + SportBookMarketHelper.getPlaces(eachWayPositions[0]);
            return eachWayStr?.toLocaleUpperCase();
        } else {
            return eachWay?.toLocaleUpperCase();
        }
    }

    public prepareRunnersContent(
        greyhoundRacingContent: GreyhoundStaticContent,
        racingContent: ManualGreyhoundRacingTemplateResult,
        gantryCommonContent: GantryCommonContent,
    ) {
        const manualGreyhoundRacingRunners = new ManualGreyhoundRacingRunners();
        manualGreyhoundRacingRunners.greyhoundRacingContent = greyhoundRacingContent;
        if (racingContent?.timehrs && racingContent?.timemins) {
            manualGreyhoundRacingRunners.eventTime = StringHelper.convertTo12HrsFormat(racingContent?.timehrs, racingContent?.timemins);
        }
        manualGreyhoundRacingRunners.eventTitle = racingContent?.meetingName ?? '';
        manualGreyhoundRacingRunners.racingContent = new RacingContentData();
        manualGreyhoundRacingRunners.racingContent.raceNo = racingContent?.race ?? '';
        manualGreyhoundRacingRunners.racingContent.distance = racingContent?.distance ?? '';
        manualGreyhoundRacingRunners.racingContent.grade = racingContent?.grade ?? '';
        manualGreyhoundRacingRunners.isRaceOff = racingContent?.raceoff ?? false;
        manualGreyhoundRacingRunners.runnerCount = racingContent?.run ?? '';
        manualGreyhoundRacingRunners.greyhoundRacingEntries = this.setGreyhoundRacingRunnersEntries(racingContent?.Runners);
        manualGreyhoundRacingRunners.marketEachWayString = this.setEachWay(racingContent?.eachway);
        manualGreyhoundRacingRunners.isFullScreenType = this.screenTypeService?.isFullScreenType;
        manualGreyhoundRacingRunners.isHalfScreenType = this.screenTypeService?.isHalfScreenType;
        manualGreyhoundRacingRunners.isUKEvent = racingContent?.country?.toUpperCase() == TypeFlagCode.Uk;
        manualGreyhoundRacingRunners.hasAnyReservedRunner = racingContent?.Runners?.some((p) => !!p.isReserved);

        const prices = manualGreyhoundRacingRunners.greyhoundRacingEntries
            .filter((greyhoundEntry: ManualGreyhoundRacingEntry) => greyhoundEntry.actualPrice !== 0)
            .map((greyhoundEntry) => greyhoundEntry.actualPrice);
        manualGreyhoundRacingRunners.favPrice = Math.min(...prices);
        manualGreyhoundRacingRunners.gantryCommonContent = gantryCommonContent;

        return manualGreyhoundRacingRunners;
    }

    public prepareResultContent(
        greyhoundRacingContent: GreyhoundStaticContent,
        racingContent: ManualGreyhoundRacingTemplateResult,
        gantryCommonContent: GantryCommonContent,
    ) {
        const manualGreyhoundRacingResults = new ManualGreyhoundRacingResults();
        manualGreyhoundRacingResults.isAnyEventResulted = racingContent?.isEventResulted;
        manualGreyhoundRacingResults.greyhoundRacingContent = greyhoundRacingContent;
        if (racingContent?.timehrs && racingContent?.timemins) {
            manualGreyhoundRacingResults.eventTime = StringHelper.convertTo12HrsFormat(racingContent?.timehrs, racingContent?.timemins);
        }
        manualGreyhoundRacingResults.eventTitle = racingContent?.meetingName ?? '';
        manualGreyhoundRacingResults.racingContent = new RacingContentData();
        manualGreyhoundRacingResults.racingContent.raceNo = racingContent?.race;
        manualGreyhoundRacingResults.racingContent.distance = racingContent?.distance ?? '';
        manualGreyhoundRacingResults.racingContent.grade = racingContent?.grade ?? '';
        const vacantRunners = this.prepareVacantRunners(racingContent.Runners);
        manualGreyhoundRacingResults.vacantRunners = vacantRunners?.length
            ? (greyhoundRacingContent?.contentParameters?.Vacant ?? '') + ': ' + vacantRunners
            : '';

        // limit rows based on activerows
        const activeRunners = racingContent.Runners.slice(0, racingContent?.activerows);
        const favouriteRunners = racingContent.Runners.filter((runner) => runner.isFavourite);
        const favouriteFlag = StringHelper.getFavouriteFlag(favouriteRunners.length);
        manualGreyhoundRacingResults.runners = this.setGreyhoundRacingResultEntries(activeRunners, favouriteFlag);
        manualGreyhoundRacingResults.foreCast = StringHelper.checkToteResults(racingContent?.forecast ?? '');
        manualGreyhoundRacingResults.triCast = StringHelper.checkToteResults(racingContent?.tricast ?? '');
        manualGreyhoundRacingResults.isRaceOff = racingContent?.raceoff ?? false;
        manualGreyhoundRacingResults.runnerCount = racingContent?.run ?? '';
        manualGreyhoundRacingResults.marketEachWayString = this.setEachWay(racingContent?.eachway ?? '');
        manualGreyhoundRacingResults.isFullScreenType = this.screenTypeService?.isFullScreenType;
        manualGreyhoundRacingResults.isHalfScreenType = this.screenTypeService?.isHalfScreenType;
        manualGreyhoundRacingResults.hasAnyReservedRunner = racingContent.Runners?.some((p: Runner) => !!p.isReserved);
        manualGreyhoundRacingResults.isUKEvent = racingContent?.country?.toUpperCase() == TypeFlagCode.Uk;
        manualGreyhoundRacingResults.gantryCommonContent = gantryCommonContent;

        return manualGreyhoundRacingResults;
    }

    private setGreyhoundRacingRunnersEntries(runnerShowPrices: Runner[]) {
        const activeRunners: Array<ManualGreyhoundRacingEntry> = [];

        if (runnerShowPrices) {
            for (const manualGreyHoundEntry of runnerShowPrices) {
                const greyhoundRacingEntry = new ManualGreyhoundRacingEntry();
                greyhoundRacingEntry.greyhoundName = manualGreyHoundEntry?.greyhoundName;
                greyhoundRacingEntry.isReserved = manualGreyHoundEntry?.isReserved;
                if (manualGreyHoundEntry?.isReserved) {
                    greyhoundRacingEntry.greyhoundName = StringHelper.checkReserveRunner(greyhoundRacingEntry.greyhoundName);
                }
                greyhoundRacingEntry.greyhoundName = StringHelper.selectionNameLengthAndTrimEnd(
                    greyhoundRacingEntry.greyhoundName,
                    SelectionNameLength.Sixteen,
                );
                if (manualGreyHoundEntry?.isVacant) {
                    greyhoundRacingEntry.greyhoundName = PriceType.nonRunner;
                }
                greyhoundRacingEntry.nonRunner = manualGreyHoundEntry?.isVacant;
                greyhoundRacingEntry.trapNumber = manualGreyHoundEntry?.trapNumber;
                greyhoundRacingEntry.isStartPrice = manualGreyHoundEntry?.isStartPrice;
                greyhoundRacingEntry.isVacant = manualGreyHoundEntry?.isVacant;
                greyhoundRacingEntry.currentPrice = manualGreyHoundEntry?.isVacant
                    ? ''
                    : manualGreyHoundEntry?.isStartPrice
                      ? PriceType.startPrice
                      : this.getPrice(manualGreyHoundEntry?.price_odds_sp);
                greyhoundRacingEntry.actualPrice = manualGreyHoundEntry?.isVacant ? 0 : this.actualPrice(manualGreyHoundEntry?.price_odds_sp);
                activeRunners.push(greyhoundRacingEntry);
            }
        }

        activeRunners?.sort((a, b) => Number(a.trapNumber) - Number(b.trapNumber));
        return activeRunners;
    }

    private setGreyhoundRacingResultEntries(runnerResults: Runner[], favouriteFlag: string) {
        const activeRunners: Array<ManualGreyhoundRacingResultDetails> = [];

        for (const manualGreyHoundEntry of runnerResults) {
            const greyhoundRacingEntry = new ManualGreyhoundRacingResultDetails();
            greyhoundRacingEntry.greyhoundName = manualGreyHoundEntry?.greyhoundName;
            greyhoundRacingEntry.isReserved = manualGreyHoundEntry?.isReserved;

            greyhoundRacingEntry.greyhoundName = StringHelper.selectionNameLengthAndTrimEnd(
                greyhoundRacingEntry.greyhoundName,
                SelectionNameLength.Sixteen,
            );

            greyhoundRacingEntry.position = manualGreyHoundEntry?.finished;
            greyhoundRacingEntry.isFavourite = manualGreyHoundEntry?.isFavourite;
            greyhoundRacingEntry.isStartPrice = manualGreyHoundEntry?.isStartPrice;
            if (manualGreyHoundEntry?.isFavourite) {
                greyhoundRacingEntry.favourite = favouriteFlag;
            }
            greyhoundRacingEntry.trapNo = manualGreyHoundEntry?.trapNumber;
            greyhoundRacingEntry.price = this.getPrice(manualGreyHoundEntry?.result_odds_sp);

            greyhoundRacingEntry.currentPrice = greyhoundRacingEntry.price;
            if (!manualGreyHoundEntry?.isVacant) {
                activeRunners.push(greyhoundRacingEntry);
            }
        }

        activeRunners?.sort((a, b) => Number(a.position) - Number(b.position) || Number(a.trapNo) - Number(b.trapNo));
        return activeRunners;
    }

    private prepareVacantRunners(runners: Runner[]): string {
        const vacantRunners: string[] = [];
        runners.forEach((runner) => {
            if (runner.isVacant) {
                vacantRunners.push(runner?.trapNumber?.toString());
            }
        });
        return vacantRunners?.sort()?.toString()?.replaceAll(',', ', ');
    }

    subscribeToSignalR() {
        this.signalrService.hubSingleRMessage$.subscribe((eventformdata: any) => {
            if (eventformdata) {
                const eventData: ManualGreyhoundRacingTemplateResult = Object.assign(new ManualGreyhoundRacingTemplateResult(), eventformdata);
                this.racingContentBehaviourSubject$.next(eventData);
            }
        });
    }

    getPrice(price: string) {
        if (!price) {
            return '';
        }
        let finalPrice = price.replace(/\/1$/, '');
        finalPrice = this.prepareEvs(finalPrice);
        return finalPrice;
    }

    prepareEvs(price: string): string {
        if (!price) {
            return '';
        }
        const finalPrice = price?.replace(/\s/g, ''); //Remove all spaces from SelectonName
        if (finalPrice === '1' || finalPrice === '1/1') {
            return PriceType.evs;
        }
        return finalPrice;
    }

    actualPrice(price: string): number {
        if (!price) {
            return 0;
        }
        price = price.replace(/\s/g, '');
        const priceParts = price.split('/');

        const numPrice = parseInt(priceParts[0]);
        const denPrice = priceParts.length == 2 ? parseInt(priceParts[1]) : 1;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return 0;
        } else {
            return numPrice / denPrice;
        }
    }

    log(message: string, level: LogType = LogType.Error, status: string, fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
