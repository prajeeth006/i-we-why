import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { PriceType, SelectionNameLength } from '../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryCommonContentService } from '../../../../common/services/gantry-common-content.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { ScreenTypeService } from '../../../../common/services/screen-type.service';
import { SignalrService } from '../../../../common/signalRService/signalr.service';
import { GreyhoundRacingMarkets } from '../../../models/common.model';
import {
    ManualGreyhoundRacingEntry,
    ManualGreyhoundRacingResponse,
    ManualGreyhoundRacingResultDetails,
    ManualGreyhoundRacingResults,
    ManualGreyhoundRacingRunners,
    ManualGreyhoundRacingTemplateResult,
    RacingContentData,
    Runner,
} from '../../../models/greyhound-racing-manual-template.model';
import { GreyhoundStaticContent } from '../../../models/greyhound-racing-template.model';
import { TypeFlagCode } from '../../../models/greyhound-racing.enum';
import { PostPickNbService } from '../../greyhound-racing-template/runners/services/post-pick-nb.service';
import { GreyhoundRacingContentService } from '../../greyhound-racing-template/services/greyhound-racing-content.service';

@Injectable({
    providedIn: 'root',
})
export class ManualGreyhoundRacingTemplateService {
    countryFlag: string | null | undefined;
    gantryCommonContent: GantryCommonContent;
    errorMessage$ = this.errorService.errorMessage$;
    racingContentBehaviourSubject$ = new BehaviorSubject<ManualGreyhoundRacingTemplateResult>(new ManualGreyhoundRacingTemplateResult());

    constructor(
        private errorService: ErrorService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        public screenTypeService: ScreenTypeService,
        public postPickNbService: PostPickNbService,
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

        if ((eachWayPositions && (eachWayPositions[2] === '1/1' || eachWay?.toLocaleUpperCase() === GreyhoundRacingMarkets.WinOnly)) || !eachWay) {
            return GreyhoundRacingMarkets.WinOnly;
        }

        if (eachWayPositions?.length == 4) {
            const eachWayStr =
                'EACH-WAY: ' + eachWayPositions[2] + ' ' + eachWayPositions[3] + ', ' + eachWayPositions[0] + ' ' + eachWayPositions[1];
            return eachWayStr.toLocaleUpperCase();
        } else {
            return eachWay.toLocaleUpperCase();
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
            manualGreyhoundRacingRunners.eventTimePlusTypeName =
                racingContent?.timehrs + ':' + racingContent?.timemins + ' ' + racingContent?.meetingName;
        }
        manualGreyhoundRacingRunners.racingContent = new RacingContentData();
        manualGreyhoundRacingRunners.racingContent.raceNo = racingContent?.race ?? '';
        manualGreyhoundRacingRunners.racingContent.distance = racingContent?.distance ?? '';
        manualGreyhoundRacingRunners.racingContent.grade = racingContent?.grade ?? '';
        manualGreyhoundRacingRunners.isRaceOff = racingContent?.raceoff ?? false;
        manualGreyhoundRacingRunners.runnerCount = racingContent?.run ?? '';
        manualGreyhoundRacingRunners.greyhoundRacingEntries = this.setGreyhoundRacingRunnersEntries(racingContent?.Runners, greyhoundRacingContent);
        manualGreyhoundRacingRunners.marketEachWayString = this.setEachWay(racingContent?.eachway);
        manualGreyhoundRacingRunners.isFullScreenType = this.screenTypeService.isFullScreenType;
        manualGreyhoundRacingRunners.isHalfScreenType = this.screenTypeService.isHalfScreenType;
        manualGreyhoundRacingRunners.isUKEvent = racingContent?.country?.toUpperCase() == TypeFlagCode.Uk;
        manualGreyhoundRacingRunners.hasAnyReservedRunner = racingContent?.Runners?.some((p) => !!p.isReserved);

        const prices = manualGreyhoundRacingRunners.greyhoundRacingEntries.filter((p) => p.actualPrice !== 0).map((p) => p.actualPrice);
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
        manualGreyhoundRacingResults.isAnyEventResulted = racingContent?.isEventResulted ?? false;
        manualGreyhoundRacingResults.greyhoundRacingContent = greyhoundRacingContent;
        if (racingContent?.timehrs && racingContent?.timemins) {
            manualGreyhoundRacingResults.eventTimePlusTypeName =
                racingContent?.timehrs +
                ':' +
                racingContent?.timemins +
                ' ' +
                racingContent?.meetingName +
                ' - ' +
                (greyhoundRacingContent?.contentParameters?.Result ?? '');
        }
        manualGreyhoundRacingResults.racingContent = new RacingContentData();
        manualGreyhoundRacingResults.racingContent.raceNo = racingContent?.race ?? '';
        manualGreyhoundRacingResults.racingContent.distance = racingContent?.distance ?? '';
        manualGreyhoundRacingResults.racingContent.grade = racingContent?.grade ?? '';

        // limit rows based on activerows
        const activeRunners = racingContent?.Runners.slice(0, racingContent.activerows);
        const favouriteRunners = racingContent?.Runners.filter((runner) => runner.isFavourite);
        const favouriteFlag = StringHelper.getFavouriteFlag(favouriteRunners.length);
        manualGreyhoundRacingResults.runners = this.setGreyhoundRacingResultEntries(activeRunners, greyhoundRacingContent, favouriteFlag);
        manualGreyhoundRacingResults.foreCast = StringHelper.checkToteResults(racingContent?.forecast);
        manualGreyhoundRacingResults.triCast = StringHelper.checkToteResults(racingContent?.tricast);
        manualGreyhoundRacingResults.isRaceOff = racingContent?.raceoff ?? false;
        manualGreyhoundRacingResults.runnerCount = racingContent?.run ?? '';
        manualGreyhoundRacingResults.marketEachWayString = this.setEachWay(racingContent?.eachway);
        manualGreyhoundRacingResults.isFullScreenType = this.screenTypeService.isFullScreenType;
        manualGreyhoundRacingResults.isHalfScreenType = this.screenTypeService.isHalfScreenType;
        manualGreyhoundRacingResults.hasAnyReservedRunner = racingContent?.Runners?.some((p) => !!p.isReserved);

        manualGreyhoundRacingResults.gantryCommonContent = gantryCommonContent;
        return manualGreyhoundRacingResults;
    }

    private setGreyhoundRacingRunnersEntries(runnerShowPrices: Runner[], greyhoundRacingContent: GreyhoundStaticContent) {
        const activeRunners: Array<ManualGreyhoundRacingEntry> = [];

        if (runnerShowPrices) {
            for (const manualGrey of runnerShowPrices) {
                const greyhoundRacingEntry = new ManualGreyhoundRacingEntry();
                greyhoundRacingEntry.greyhoundName = manualGrey.greyhoundName;
                greyhoundRacingEntry.isReserved = manualGrey.isReserved;
                if (manualGrey.isReserved) {
                    greyhoundRacingEntry.greyhoundName = StringHelper.checkReserveRunner(greyhoundRacingEntry.greyhoundName);
                }
                greyhoundRacingEntry.greyhoundName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    greyhoundRacingEntry.greyhoundName,
                    SelectionNameLength.Eighteen,
                );
                if (manualGrey.isVacant) {
                    greyhoundRacingEntry.greyhoundName = PriceType.nonRunner;
                }
                greyhoundRacingEntry.nonRunner = manualGrey.isVacant;
                greyhoundRacingEntry.trapNumber = manualGrey.trapNumber;
                greyhoundRacingEntry.isStartPrice = manualGrey.isStartPrice;
                greyhoundRacingEntry.isVacant = manualGrey.isVacant;
                greyhoundRacingEntry.currentPrice = manualGrey.isVacant
                    ? ''
                    : manualGrey.isStartPrice
                      ? PriceType.startPrice
                      : this.getPrice(manualGrey.price_odds_sp);
                greyhoundRacingEntry.actualPrice = manualGrey.isVacant ? 0 : this.actualPrice(manualGrey.price_odds_sp);
                greyhoundRacingEntry.jockeySilkImage = this.postPickNbService.greyhoundRacingPostTipImage(
                    manualGrey.trapNumber,
                    greyhoundRacingContent,
                );
                activeRunners.push(greyhoundRacingEntry);
            }
        }
        return activeRunners;
    }

    private setGreyhoundRacingResultEntries(runnerResults: Runner[], greyhoundRacingContent: GreyhoundStaticContent, favouriteFlag: string) {
        const activeRunners: Array<ManualGreyhoundRacingResultDetails> = [];

        for (const manualGrey of runnerResults) {
            const greyhoundRacingEntry = new ManualGreyhoundRacingResultDetails();
            greyhoundRacingEntry.greyhoundName = manualGrey.greyhoundName;
            greyhoundRacingEntry.isReserved = manualGrey.isReserved;

            greyhoundRacingEntry.greyhoundName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                greyhoundRacingEntry.greyhoundName,
                SelectionNameLength.Eighteen,
            );

            greyhoundRacingEntry.position = manualGrey.finished;
            greyhoundRacingEntry.jockeySilkImage = this.postPickNbService.greyhoundRacingPostTipImage(manualGrey.trapNumber, greyhoundRacingContent);
            greyhoundRacingEntry.isFavourite = manualGrey.isFavourite;
            greyhoundRacingEntry.isStartPrice = manualGrey.isStartPrice;
            if (manualGrey.isFavourite) {
                greyhoundRacingEntry.favourite = favouriteFlag;
            }
            greyhoundRacingEntry.trapNo = manualGrey.trapNumber;
            greyhoundRacingEntry.price = this.getPrice(manualGrey.result_odds_sp);
            greyhoundRacingEntry.currentPrice = greyhoundRacingEntry.price;
            if (!manualGrey.isVacant) {
                activeRunners.push(greyhoundRacingEntry);
            }
        }

        activeRunners?.sort((a, b) => Number(a.position) - Number(b.position) || Number(a.trapNo) - Number(b.trapNo));
        return activeRunners;
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
            return 'EVS';
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
