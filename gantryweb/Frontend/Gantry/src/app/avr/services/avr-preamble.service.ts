import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, tap } from 'rxjs';
import { FillerPageService } from 'src/app/common/components/filler-page/services/filler-page.service';
import { AvrRacers, AvrResult, AvrTags } from 'src/app/common/models/data-feed/avr.model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { AvrImageService } from 'src/app/common/services/data-feed/avr-service/avr-image.service';
import { AvrDataFeedService } from 'src/app/common/services/data-feed/avr-service/avr-data-feed.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { AvrTemplate, ResultDetails } from '../models/avr-template.model';
import { AvrContentService } from './avr-result-content.service';
import { AvrEventTypeEnum, AvrTagsEnum } from '../models/avr-result-enum.model';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Injectable({
    providedIn: 'root'
})
export class AvrPreambleService {

    avrPreamblePage: AvrTemplate = new AvrTemplate();
    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
    private subject = new BehaviorSubject<string>(null);
    counterValue$ = this.subject.asObservable();

    seconds: number;

    newDate = new Date();

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        catchError(err => {
            this.virtualRaceImageService.logError(err);
            return EMPTY;
        })
    );

    avrBrandImage$ = this.avrImageService.brandImage$.pipe(
        catchError(err => {
            return EMPTY;
        })
    );

    avrBackgroundImage$ = this.avrImageService.backgroundImage$.pipe(
        catchError(err => {
            return EMPTY;
        })
    );

    staticContent$ = this.avrContentService.data$
        .pipe(
            catchError(err => {
                return EMPTY;
            })
        );

    data$ = combineLatest([
        this.avrBrandImage$,
        this.avrBackgroundImage$,
        this.staticContent$
    ]).pipe(
        map(([
            brandImageContent, backgroundImageContent, staticContent]) => {
            this.avrPreamblePage.brandImageUrl = brandImageContent?.brandImage?.src;
            this.avrPreamblePage.backgroundImageUrl = backgroundImageContent?.brandImage?.src;
            this.avrPreamblePage.staticContent = staticContent;
            this.fillerPageService.unSetFillerPage();
            if (this.avrPreamblePage?.resultsTable?.length <= 0) {
                throw `Couldn't find data for preamblePage runners`;
            }
            this.errorService.unSetError();
            return this.avrPreamblePage;
        }),
        catchError(err => {
            this.errorService.logError(err);
            return EMPTY;
        }),
        tap((avrResultTemplate: AvrTemplate) => { }),
        catchError(err => {
            return EMPTY;
        })
    );

    constructor(private avrService: AvrDataFeedService, private errorService: ErrorService, private avrContentService: AvrContentService, private fillerPageService: FillerPageService,
        private avrImageService: AvrImageService, private virtualRaceImageService: VirtualRaceImageService) {
    }

    setControllerId(controllerId: string) {
        this.avrService.setControllerId(new QueryParamEvent(controllerId));
    }

    setPreambleTemplate(result: AvrResult) {
        // here based on event race types updated

        this.avrPreamblePage.avrEventType = result?.avr?.eventType;
        this.avrImageService.setEventType(result?.avr?.eventType);
        let meetingName = result?.avr?.eventName?.trim()?.toUpperCase();
        if (!!meetingName && meetingName.trim().length > 2) {
            meetingName = meetingName.trim().substring(0, meetingName.length - 2)?.trim()?.toUpperCase();
        }

        this.virtualRaceImageService.setEventAndMeetingName(result?.avr?.eventType, meetingName, "")
        this.virtualRaceImageService$.subscribe((runnerImageContent) => {
            this.avrPreamblePage?.resultsTable?.forEach(runner => {
                if (runnerImageContent?.runnerImages?.length >= Number(runner.runnerNumber)) {
                    runner.imageSourceUrl = runnerImageContent?.runnerImages[Number(runner.runnerNumber) - 1]?.src;
                }
            });
        });
        this.avrPreamblePage = new AvrTemplate();
        this.avrPreamblePage.isResultedOrOff = false;
        this.newDate = new Date();
        this.avrPreamblePage = this.createViewerEventCardData(this.avrPreamblePage, result);
        if (!!this.seconds) this.avrPreamblePage.counterValue$ = this.countdownTime();
    }

    setOffTemplate() {
        this.avrPreamblePage.isResultedOrOff = true;
    }

    private createViewerEventCardData(avrPreamblePage: AvrTemplate, result: AvrResult): AvrTemplate {
        avrPreamblePage.avrEventType = result?.avr?.eventType;
        avrPreamblePage.runnerCount = result.avr?.numOfRacers;
        avrPreamblePage.numEachWay = result.avr?.numEachWay;
        avrPreamblePage.distance = result.avr?.distance.toUpperCase();
        avrPreamblePage.eventName = this.setEventName(result.avr?.eventName, result.avr?.eventDateTime);
        avrPreamblePage = this.setRunnerDetails(avrPreamblePage, result.avr?.racers);
        avrPreamblePage = this.setEachWayDetails(avrPreamblePage, result.avr?.tags);
        return avrPreamblePage;
    }

    private setEventName(meetingName: string, eventDateTime: string): string {
        let eventName = "";
        if (!!meetingName && meetingName.trim().length > 2) {
            meetingName = meetingName.trim().substring(0, meetingName.length - 2);
        }
        let dateTime = eventDateTime.split(' ');
        if (dateTime.length > 1) {
            let time = dateTime[1].split(':');
            if (time.length >= 2) {
                eventName = time[0] + ":" + time[1] + " " + meetingName;
            }
        }
        return eventName;
    }

    private setRunnerDetails(avrPreamblePage: AvrTemplate, racers: Array<AvrRacers>): AvrTemplate {
        racers.forEach((racer: AvrRacers) => {
            let result = new ResultDetails();
            result.runnerNumber = racer.num;
            result.runnerName = StringHelper.checkSelectionNameLengthAndTrimEnd(racer.name, SelectionNameLength.Eighteen);
            result.price = racer?.price?.endsWith('/1') ? racer?.price?.substring(0, racer?.price?.indexOf('/')) : racer?.price;
            avrPreamblePage.resultsTable?.push(result);
        });
        let smallestPrice = "";
        avrPreamblePage.resultsTable = avrPreamblePage.resultsTable?.sort((a, b) => {
            return eval(a.price) - eval(b.price)
        });
        if (avrPreamblePage.resultsTable.length > 1) {
            smallestPrice = avrPreamblePage?.resultsTable[0].price;
        }

        avrPreamblePage?.resultsTable?.forEach(element => {
            if (element.price == smallestPrice) {
                element.isFavourite = true;
            }
            else {
                element.isFavourite = false;
            }
        });
        let raceingTypes = [AvrEventTypeEnum.HorseRace, AvrEventTypeEnum.MotorRace]
        if (avrPreamblePage?.avrEventType == AvrEventTypeEnum.MotorRace) {
            if (avrPreamblePage?.resultsTable?.length > 1) {
                avrPreamblePage?.resultsTable?.sort(function (a, b) { return Number(a?.price) - Number(b?.price) })
            }
        }
        else if (!raceingTypes?.includes(avrPreamblePage?.avrEventType)) {
            avrPreamblePage.resultsTable = avrPreamblePage?.resultsTable?.sort((a, b) => {
                return Number(a.runnerNumber) - Number(b.runnerNumber)
            });
        }

        return avrPreamblePage;
    }

    private setEachWayDetails(avrPreamblePage: AvrTemplate, tags: Array<AvrTags>): AvrTemplate {
        let eachWayFraction: string = "";
        let eachWayTerms: string = "";
        tags.forEach((tag: AvrTags) => {
            if (tag?.name?.toUpperCase() == AvrTagsEnum.EachWayTerms) {
                if (Number(tag.value) > 0) {
                    eachWayFraction = "1/" + tag.value;
                }
            }
            else if (tag?.name?.toUpperCase() == AvrTagsEnum.NumEachWay) {
                if (Number(tag.value) > 0) {
                    for (let i = 1; i <= Number(tag.value); i++) {
                        eachWayTerms += i + "-";
                    }
                    eachWayTerms = eachWayTerms.substring(0, eachWayTerms.length - 1);
                }
            }
            if (!!eachWayFraction && !!eachWayTerms) {
                avrPreamblePage.eachWay = eachWayFraction + " " + eachWayTerms;
                return avrPreamblePage;
            }
        });
        return avrPreamblePage;
    }

    private setCountdownTimerValue(): string {
        let endDate = new Date(this.newDate.getTime() + this.seconds * 1000);
        let minutes = Math.floor((endDate.getTime() - new Date().getTime()) / (1000 * 60) % 60);
        let seconds = Math.floor((endDate.getTime() - new Date().getTime()) / (1000) % 60);
        let minute = minutes < 10 ? '' + minutes : minutes.toString();
        let second = seconds < 10 ? '0' + seconds : seconds.toString();
        if (seconds < 0 || minutes < 0) {
            this.avrPreamblePage.isResultedOrOff = true;
            return "";
        }
        this.avrPreamblePage.isResultedOrOff = false;
        return minute + ":" + second;
    }

    private countdownTime() {
        return new Observable<string>(observer => {
            setInterval(() => {
                observer.next(this.setCountdownTimerValue());
            }, 1000)
        })
    }

}
