import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';

import { BrandImageContent } from '../../../../../common/components/error/models/error-content.model';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../../common/services/error.service';
import { HttpService } from '../../../../../common/services/http.service';
import { Log, LogType, LoggerService } from '../../../../../common/services/logger.service';
import { SignalrService } from '../../../../../common/signalRService/signalr.service';
import { HorseRacingMarkets } from '../../../../models/common.model';
import {
    ManualHorseRacingEntry,
    ManualHorseRacingResponse,
    ManualHorseRacingRunners,
    ManualHorseRacingTemplateResult,
    ManualHorseRunners,
    RacingContentData,
} from '../../../../models/horse-racing-manual-template.model';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../../../services/horseracing-content.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeManualHorseRacingTemplateService {
    errorMessage$ = this.errorService.errorMessage$;
    racingContentBehaviourSubject$ = new BehaviorSubject<ManualHorseRacingTemplateResult>(null!);

    constructor(
        private httpService: HttpService,
        private errorService: ErrorService,
        private horseRacingContent: HorseRacingContentService,
        private signalrService: SignalrService,
        private loggerService: LoggerService,
    ) {
        this.subscribeToSignalR();
    }

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        startWith({} as HorseRacingContent), // Initial value
    );

    racingContent$: Observable<ManualHorseRacingTemplateResult> = this.racingContentBehaviourSubject$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    manualHorseRacingImage$ = this.httpService
        .get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/HorseRacingContent/ManualHorseRacingImage')
        .pipe(
            catchError(() => {
                return EMPTY;
            }),
            shareReplay(),
        );

    data$ = combineLatest([this.horseRacingContent$, this.racingContent$, this.manualHorseRacingImage$]).pipe(
        map(([horseRacingContent, racingContent, manualHorseRacingImageContent]) => {
            return this.setHorseRacingData(horseRacingContent, racingContent, manualHorseRacingImageContent);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    setHorseRacingData(horseRacingContent: any, racingContent: any, manualHorseRacingImageContent: any) {
        const manualHorseRacingTemplateData = new ManualHorseRacingResponse();
        try {
            manualHorseRacingTemplateData.isAnyEventResulted = racingContent?.isEventResulted;
            manualHorseRacingTemplateData.manualHorseRacingRunners = new ManualHorseRacingRunners();

            manualHorseRacingTemplateData.manualHorseRacingRunners.horseRacingContent = horseRacingContent;
            manualHorseRacingTemplateData.manualHorseRacingRunners.categoryName = horseRacingContent?.contentParameters?.Title ?? '';
            if (!!racingContent?.timehrs && !!racingContent?.timemins) {
                manualHorseRacingTemplateData.manualHorseRacingRunners.eventTime = StringHelper.convertTo12HrsFormat(
                    racingContent?.timehrs,
                    racingContent?.timemins,
                );
            }
            manualHorseRacingTemplateData.manualHorseRacingRunners.eventTitle = racingContent?.meetingName;
            manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent = new RacingContentData();
            manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.raceNo = racingContent?.race ? parseInt(racingContent.race) : null;
            manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.distance = racingContent?.distance;
            manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.going = racingContent?.going;

            const manualHorseRacingImage = manualHorseRacingImageContent.brandImage.src;
            this.setHorseRacingEntries(manualHorseRacingTemplateData, racingContent?.Runners, manualHorseRacingImage);

            manualHorseRacingTemplateData.manualHorseRacingRunners.isRaceOff = racingContent?.raceoff;
            manualHorseRacingTemplateData.manualHorseRacingRunners.runnerCount = racingContent?.run;
            manualHorseRacingTemplateData.manualHorseRacingRunners.marketEachWayString = this.setEachWay(racingContent?.eachway);
        } catch (e) {
            this.signalrService.setSignalRErrorStatus(e.stack);
            console.error(e);
            this.log(`Error in processing ManualHorseRacingResponse ${e}`, LogType.Error, 'NA', true);
        }
        return manualHorseRacingTemplateData;
    }

    public setEachWay(eachWay: string): string {
        const eachWayPositions = eachWay?.trim()?.split(' ');
        if ((!!eachWayPositions && (eachWayPositions[2] === '1/1' || eachWay?.toLocaleUpperCase() === HorseRacingMarkets.WinOnly)) || !eachWay) {
            return HorseRacingMarkets.WinOnly;
        }
        if (eachWayPositions?.length == 4) {
            let placeSplitter: string = '';
            if (eachWayPositions[0] && Number(eachWayPositions[0]) > 1) {
                for (let i = 1; i <= Number(eachWayPositions[0]); i++) {
                    placeSplitter = placeSplitter + i + (i < Number(eachWayPositions[0]) ? '-' : '');
                }
            }

            const eachWayStr = eachWayPositions[2] + ' ' + eachWayPositions[3] + ', ' + placeSplitter;
            return eachWayStr?.replaceAll(',', '');
        } else {
            return eachWay?.replaceAll(',', '');
        }
    }

    public setHorseRacingEntries(
        manualHorseRacingResponse: ManualHorseRacingResponse,
        runnerShowPrices: ManualHorseRunners[],
        manualHorseRacingImage: string,
    ) {
        if (runnerShowPrices) {
            const activeRunners: Array<ManualHorseRacingEntry> = [];
            const inactiveRunners: Array<ManualHorseRacingEntry> = [];
            manualHorseRacingResponse.manualHorseRacingRunners.horseRacingEntries = [];
            for (const manualHorse of runnerShowPrices) {
                const horseRacingEntry = new ManualHorseRacingEntry();
                horseRacingEntry.horseNumber = manualHorse?.horseNumber;
                horseRacingEntry.horseName = manualHorse.horseName;
                const reserve = manualHorseRacingResponse?.manualHorseRacingRunners?.horseRacingContent?.contentParameters?.NewDesignReserve ?? '';
                if (horseRacingEntry.horseName?.toLowerCase().includes(reserve?.toLowerCase())) {
                    horseRacingEntry.isReserved = true;
                    horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                        StringHelper.checkReserveRunner(horseRacingEntry.horseName),
                        SelectionNameLength?.Thirteen,
                    );
                }
                horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(horseRacingEntry.horseName, SelectionNameLength?.Eighteen);
                horseRacingEntry.jockeyName = manualHorse?.jockeyName;
                horseRacingEntry.nonRunner = manualHorse?.isNonRunner;
                horseRacingEntry.isStartPrice = manualHorse?.isStartPrice;

                horseRacingEntry.jockeySilkImage = manualHorseRacingImage;

                if (horseRacingEntry.nonRunner) {
                    horseRacingEntry.jockeyName =
                        manualHorseRacingResponse?.manualHorseRacingRunners?.horseRacingContent?.contentParameters?.NewDesignNonRunner ?? '';
                    inactiveRunners.push(horseRacingEntry);
                } else {
                    horseRacingEntry.fractionPrice = manualHorse?.price_odds_sp;
                    horseRacingEntry.currentPrice = manualHorse?.isStartPrice
                        ? 0
                        : StringHelper.calculatedPrice(manualHorse?.price_odds_sp?.toString());
                    activeRunners.push(horseRacingEntry);
                }
            }
            activeRunners.sort((a, b) => Number(a?.horseNumber) - Number(b?.horseNumber));
            activeRunners.sort((a, b) => a?.currentPrice - b?.currentPrice);
            manualHorseRacingResponse.manualHorseRacingRunners.bettingFavouritePrice = activeRunners[0]?.currentPrice;
            manualHorseRacingResponse.manualHorseRacingRunners.horseRacingEntries = [...activeRunners, ...inactiveRunners];
        }
    }

    subscribeToSignalR() {
        this.signalrService.hubSingleRMessage$.subscribe((eventformdata: any) => {
            if (eventformdata) {
                const eventData: ManualHorseRacingTemplateResult = Object.assign(new ManualHorseRacingTemplateResult(), eventformdata);
                this.racingContentBehaviourSubject$.next(eventData);
            }
        });
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
