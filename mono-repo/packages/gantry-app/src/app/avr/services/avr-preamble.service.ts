import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, map, startWith } from 'rxjs';

import { BrandImageContent } from '../../common/components/error/models/error-content.model';
import { FillerPageService } from '../../common/components/filler-page/services/filler-page.service';
import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../common/helpers/string.helper';
import { AvrRacers, AvrResult } from '../../common/models/data-feed/avr.model';
import { VirtualRaceSilkRunnerImageContent } from '../../common/models/gantry-commom-content.model';
import { QueryParamEvent } from '../../common/models/query-param.model';
import { AvrDataFeedService } from '../../common/services/data-feed/avr-service/avr-data-feed.service';
import { AvrImageService } from '../../common/services/data-feed/avr-service/avr-image.service';
import { ErrorService } from '../../common/services/error.service';
import { VirtualRaceImageService } from '../../common/services/virtual-race-image.service';
import { AvrContent } from '../models/avr-result-content.model';
import { AvrEventTypeEnum, AvrMessageTypeEnum } from '../models/avr-result-enum.model';
import { AvrTemplate, ResultDetails } from '../models/avr-template.model';
import { AvrContentService } from './avr-result-content.service';
import { AvrCommonService } from './common/avr-common.service';

@Injectable({
    providedIn: 'root',
})
export class AvrPreambleService {
    avrPreamblePage: AvrTemplate = new AvrTemplate();
    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
    private subject = new BehaviorSubject<string | null>(null);
    counterValue$ = this.subject.asObservable();
    seconds: number;

    newDate = new Date();

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        startWith({} as VirtualRaceSilkRunnerImageContent), // Initial Value
    );

    avrBrandImage$ = this.avrImageService.brandImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );

    avrBackgroundImage$ = this.avrImageService.backgroundImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );

    staticContent$ = this.avrContentService.data$.pipe(
        startWith({} as AvrContent), // Initial Value
    );

    data$ = combineLatest([this.avrBrandImage$, this.avrBackgroundImage$, this.staticContent$]).pipe(
        map(([brandImageContent, backgroundImageContent, staticContent]) => {
            this.avrPreamblePage.brandImageUrl = brandImageContent?.brandImage?.src;
            this.avrPreamblePage.backgroundImageUrl = backgroundImageContent?.brandImage?.src;
            this.avrPreamblePage.staticContent = staticContent;
            this.avrCommonService.staticContent = staticContent;

            this.fillerPageService.unSetFillerPage();
            if (this.avrPreamblePage?.resultsTable?.length <= 0) {
                throw `Couldn't find data for preamblePage runners`;
            }
            this.errorService.unSetError();
            return this.avrPreamblePage;
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private avrDataFeedService: AvrDataFeedService,
        private errorService: ErrorService,
        private avrContentService: AvrContentService,
        private fillerPageService: FillerPageService,
        private avrImageService: AvrImageService,
        private virtualRaceImageService: VirtualRaceImageService,
        private avrCommonService: AvrCommonService,
    ) {}

    setControllerId(controllerId: string) {
        this.avrDataFeedService.setControllerId(new QueryParamEvent(controllerId));
    }

    setPreambleTemplate(result: AvrResult) {
        // here based on event race types updated

        this.avrPreamblePage.avrEventType = result?.avr?.eventType;
        this.avrImageService.setEventType(result?.avr?.eventType);
        let meetingName = result?.avr?.eventName?.replace(/\d+$/, '').trim()?.toUpperCase();

        this.virtualRaceImageService.setEventAndMeetingName(result?.avr?.eventType, meetingName, '');
        this.virtualRaceImageService$.subscribe((runnerImageContent) => {
            this.avrPreamblePage?.resultsTable?.forEach((runner: ResultDetails) => {
                if (runnerImageContent?.runnerImages?.length >= Number(runner.runnerNumber)) {
                    runner.imageSourceUrl = runnerImageContent?.runnerImages[Number(runner.runnerNumber) - 1]?.src;
                }
            });
        });
        this.avrPreamblePage = new AvrTemplate();
        this.avrPreamblePage.isResultedOrOff = false;
        this.newDate = new Date();
        this.avrPreamblePage = this.createViewerEventCardData(this.avrPreamblePage, result);
        if (this.seconds) this.avrPreamblePage.counterValue$ = this.countdownTime();
    }

    private createViewerEventCardData(avrPreamblePage: AvrTemplate, result: AvrResult): AvrTemplate {
        avrPreamblePage.avrEventType = result?.avr?.eventType;
        avrPreamblePage.runnerCount = result?.avr?.numOfRacers;
        avrPreamblePage.numEachWay = result?.avr?.numEachWay;
        avrPreamblePage.distance = result?.avr?.distance?.toUpperCase();
        avrPreamblePage.eventName = this.avrCommonService.setEventName(result?.avr?.eventName, result?.avr?.eventDateTime);
        avrPreamblePage = this.setRunnerDetails(avrPreamblePage, result?.avr?.racers);
        avrPreamblePage = this.avrCommonService.setEachWayDetails(avrPreamblePage, result?.avr?.tags);
        return avrPreamblePage;
    }

    private setRunnerDetails(avrPreamblePage: AvrTemplate, racers: Array<AvrRacers>): AvrTemplate {
        const selectionNameMaxLength = this.avrCommonService.getRunnerNameMaxLengthByEventType(
            AvrMessageTypeEnum.ViewerEventCard,
            avrPreamblePage?.avrEventType,
        );
        racers.forEach((racer: AvrRacers) => {
            const result = new ResultDetails();
            result.runnerNumber = racer.num;
            result.runnerName = StringHelper.selectionNameLengthAndTrimEnd(racer?.name, selectionNameMaxLength);
            racer.price = StringHelper?.setSelectionPrice(racer?.price);
            result.price = racer?.price?.endsWith('/1') ? racer?.price?.substring(0, racer?.price?.indexOf('/')) : racer?.price;
            avrPreamblePage.resultsTable?.push(result);
        });
        let smallestPrice = '';
        avrPreamblePage.resultsTable = avrPreamblePage.resultsTable?.sort((a, b) => {
            return SportBookMarketHelper.customSort(a?.price, b?.price); //eval(a.price!) - eval(b.price!)
        });
        if (avrPreamblePage.resultsTable.length > 1) {
            smallestPrice = avrPreamblePage?.resultsTable[0]?.price ? avrPreamblePage?.resultsTable[0]?.price : '';
        }

        avrPreamblePage?.resultsTable?.forEach((element) => {
            element.isFavourite = element?.price == smallestPrice;
        });

        const racingTypes = [AvrEventTypeEnum.HorseRace, AvrEventTypeEnum.MotorRace];
        if (avrPreamblePage?.avrEventType == AvrEventTypeEnum.MotorRace) {
            if (avrPreamblePage?.resultsTable?.length > 1) {
                avrPreamblePage?.resultsTable?.sort((a, b) => {
                    return Number(a?.price) - Number(b?.price);
                });
            }
        } else if (!racingTypes?.includes(avrPreamblePage?.avrEventType)) {
            avrPreamblePage.resultsTable = avrPreamblePage?.resultsTable?.sort((a, b) => {
                return Number(a.runnerNumber) - Number(b.runnerNumber);
            });
        }

        return avrPreamblePage;
    }

    private setCountdownTimerValue(): string {
        const endDate = new Date(this.newDate.getTime() + this.seconds * 1000);
        const minutes = Math.floor(((endDate.getTime() - new Date().getTime()) / (1000 * 60)) % 60);
        const seconds = Math.floor(((endDate.getTime() - new Date().getTime()) / 1000) % 60);
        const minute = minutes < 10 ? '' + minutes : minutes.toString();
        const second = seconds < 10 ? '0' + seconds : seconds.toString();
        if (seconds < 0 || minutes < 0) {
            this.avrPreamblePage.isResultedOrOff = true;
            return '';
        }
        this.avrPreamblePage.isResultedOrOff = false;
        return minute + ':' + second;
    }

    private countdownTime(): Observable<string> {
        return new Observable<string>((observer) => {
            setInterval(() => {
                observer.next(this.setCountdownTimerValue());
            }, 1000);
        });
    }
}
