import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, catchError, combineLatest, concatMap, map, retry, shareReplay, startWith, tap, throwError } from 'rxjs';

import { FillerPageService } from '../../common/components/filler-page/services/filler-page.service';
import { BomUtilities } from '../../common/helpers/bom-utilities';
import { AvrEventMap, AvrResult } from '../../common/models/data-feed/avr.model';
import { QueryParamEvent } from '../../common/models/query-param.model';
import { AvrDataFeedService } from '../../common/services/data-feed/avr-service/avr-data-feed.service';
import { ErrorService } from '../../common/services/error.service';
import { HttpService } from '../../common/services/http.service';
import { Log, LogType, LoggerService } from '../../common/services/logger.service';
import { AvrContent, AvrPageConfiguration } from '../models/avr-result-content.model';
import { AvrEventTypeEnum, AvrMessageTypeEnum } from '../models/avr-result-enum.model';
import { AvrStates } from '../models/avr-states';
import { AvrPreambleService } from './avr-preamble.service';
import { AvrContentService } from './avr-result-content.service';
import { AvrResultService } from './avr-result.service';
import { AvrVideoService } from './avr-video.service';
import { AvrCommonService } from './common/avr-common.service';

@Injectable({
    providedIn: 'root',
})
export class AvrService {
    retryDelayTime = 3000;
    private subject = new BehaviorSubject<string | null>(null);
    controllerId$ = this.subject.asObservable();
    eventType: string;
    event: number = 0;
    cycleStarted: boolean = false;
    cycleCompleted: boolean = false;
    previousEvent: AvrResult;
    previousPreamblevirtualEventKey: string;
    avrState$ = new BehaviorSubject<string>('');
    avrStates: typeof AvrStates = AvrStates;
    urlStaleDataMap = new Map<number, string>();
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;

    preambleTimeHorse: number;
    preambleTimeDog: number;
    preambleTimeMotor: number;
    countdownHorse: number;
    countdownDog: number;
    countdownMotor: number;
    videoTimeHorse: number;
    videoTimeJumpHorse: number;
    videoTimeDog: number;
    videoTimeMotor: number;
    resultTimeHorse: number;
    resultTimeJumpHorse: number;
    resultTimeDog: number;
    resultTimeMotor: number;
    offTime: number;
    isOverlay: boolean;

    avrDataFeed$ = this.avrDataFeedService.avrService$.pipe(
        catchError((err) => {
            this.errorService.logError(err);
            return throwError(() => err);
        }),
        retry({ count: Infinity, delay: this.retryDelayTime }),
    );

    avrPageConfigurations$ = this.controllerId$.pipe(
        concatMap((controllerId: string) => {
            return this.httpService.get<AvrPageConfiguration>('en/api/getAvrPageConfiguration', new HttpParams().set('controllerId', controllerId));
        }),
        startWith({} as AvrPageConfiguration), // Initial Value
        shareReplay(),
    );

    staticContent$ = this.avrContentService.data$.pipe(
        startWith({} as AvrContent), // Initial Value
    );

    avr$ = combineLatest([this.avrDataFeed$, this.avrPageConfigurations$, this.staticContent$]).pipe(
        map(([resultMap, avrPageConfig, staticContent]) => {
            this.preambleTimeHorse = avrPageConfig?.gantryAvrPageConfiguration?.horsePreambleTime ?? 119;
            this.preambleTimeDog = avrPageConfig?.gantryAvrPageConfiguration?.dogPreambleTime ?? 77;
            this.preambleTimeMotor = avrPageConfig?.gantryAvrPageConfiguration?.motorPreambleTime ?? 101;
            this.countdownHorse = avrPageConfig?.gantryAvrPageConfiguration?.horseCountdownToOffTime ?? 116;
            this.countdownDog = avrPageConfig?.gantryAvrPageConfiguration?.dogCountdownToOffTime ?? 74;
            this.countdownMotor = avrPageConfig?.gantryAvrPageConfiguration?.motorCountdownToOffTime ?? 98;
            this.videoTimeHorse = avrPageConfig?.gantryAvrPageConfiguration?.horseVideoTime ?? 34;
            this.videoTimeJumpHorse = avrPageConfig?.gantryAvrPageConfiguration?.jumpHorseVideoTime ?? 93;
            this.videoTimeDog = avrPageConfig?.gantryAvrPageConfiguration?.dogVideoTime ?? 47;
            this.videoTimeMotor = avrPageConfig?.gantryAvrPageConfiguration?.motorVideoTime ?? 74;
            this.resultTimeHorse = avrPageConfig?.gantryAvrPageConfiguration?.horseResultTime ?? 10;
            this.resultTimeJumpHorse = avrPageConfig?.gantryAvrPageConfiguration?.jumpHorseResultTime ?? 10;
            this.resultTimeDog = avrPageConfig?.gantryAvrPageConfiguration?.dogResultTime ?? 13;
            this.resultTimeMotor = avrPageConfig?.gantryAvrPageConfiguration?.motorResultTime ?? 10;
            this.offTime = avrPageConfig?.gantryAvrPageConfiguration?.offTime ?? 3;
            this.isOverlay = avrPageConfig?.gantryAvrPageOverlay?.isOverlay;
            this.avrCommonService.staticContent = staticContent;
            return resultMap;
        }),
        tap((resultMap: AvrEventMap) => {
            for (const [, data] of resultMap.eventIds) {
                const eventId = resultMap?.eventIds.keys()?.next()?.value;
                for (const [, result] of data.messageTypes) {
                    const messageType = result?.avr?.meta?.messageType?.toUpperCase() || '';
                    if (!this.cycleStarted && !this.event && messageType == AvrMessageTypeEnum.ViewerEventCard) {
                        this.event = eventId;
                    }
                    if (this.urlStaleDataMap.has(eventId)) {
                        if (messageType == this.urlStaleDataMap.get(eventId)) {
                            return;
                        }
                    } else {
                        if (!this.cycleStarted && eventId != this.event && messageType == AvrMessageTypeEnum.ViewerEventCard) {
                            this.cycleStarted = true;
                        }
                    }

                    this.urlStaleDataMap.clear();
                    this.urlStaleDataMap.set(eventId, messageType);

                    if (this.cycleStarted) {
                        if (messageType == AvrMessageTypeEnum.ViewerEventCard) {
                            // here based on event race types updated
                            this.eventType = result?.avr?.eventType;
                            this.avrCommonService.setCourseIsJump(result?.avr?.courseIsJumps);
                            if (!this.previousEvent) {
                                this.previousEvent = result;
                                this.setAvrCountDownTime(this.eventType);
                                this.preambleService.setPreambleTemplate(result);
                                this.resultService.setViewerEventCardTemplate(result);
                                this.videoService.setEventName(this.resultService?.avrResultPage?.eventName);
                                this.videoService.setOverlay(this.isOverlay);
                            }
                            if (!this.cycleCompleted) {
                                this.avrState$.next('');
                                this.showPageState(1);
                                this.cycleCompleted = true;
                            }
                            this.previousEvent = new AvrResult();
                            this.previousEvent = result;
                        } else if (messageType == AvrMessageTypeEnum.Result) {
                            this.resultService.setResultTemplate(result);
                            if (this.resultService.isResultComplete) {
                                this.fillerPageService.unSetFillerPage();
                            }
                        }
                    } else {
                        this.fillerPageService.setFillerPage('LOADING');
                    }
                }
            }
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    setControllerId(controllerId: string) {
        this.subject.next(controllerId);
        this.avrDataFeedService.setControllerId(new QueryParamEvent(controllerId));
        this.avrCommonService.setControllerId(controllerId);
    }

    getCurrentState() {
        return this.avrState$.getValue();
    }

    constructor(
        private avrDataFeedService: AvrDataFeedService,
        private preambleService: AvrPreambleService,
        private resultService: AvrResultService,
        private videoService: AvrVideoService,
        private fillerPageService: FillerPageService,
        private httpService: HttpService,
        public avrCommonService: AvrCommonService,
        private loggerService: LoggerService,
        private errorService: ErrorService,
        private avrContentService: AvrContentService,
    ) {}

    showPageState(duration: number) {
        console.log('Moving to next state after this duration: ' + duration);
        const timeOutFn: NodeJS.Timeout = setTimeout(() => {
            if (timeOutFn) clearTimeout(timeOutFn);
            console.log('Moving to Next state time:' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })));
            this.moveToNextState();
        }, duration * 1000);
    }

    moveToNextState() {
        const currentState = this.getCurrentState();
        if (currentState === '') {
            this.fillerPageService.setFillerPage('LOADING');
            this.avrState$.next(this.avrStates.ShowAvrPreamble);
            this.setShowPageState(this.eventType);
            return;
        }
        if (currentState === this.avrStates.ShowAvrPreamble) {
            this.previousPreamblevirtualEventKey = this.previousEvent.avr.virtualEventKey;
            this.log(
                'Showing Avr Video Page' + ',' + 'virtualEventKey: ' + this.previousPreamblevirtualEventKey,
                'Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })),
                LogType.Information,
            );
            this.avrState$.next(this.avrStates.ShowAvrVideo);
            console.log('Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })));
            this.getAvrVideoTime(this.eventType);
            return;
        }
        if (currentState === this.avrStates.ShowAvrVideo) {
            this.log(
                'Showing Avr Result Page' + ',' + 'virtualEventKey: ' + this.previousPreamblevirtualEventKey,
                'Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })),
                LogType.Information,
            );
            this.avrState$.next(this.avrStates.ShowAvrResult);
            console.log('Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })));
            this.getAvrResultTime(this.eventType);

            return;
        }
        if (currentState === this.avrStates.ShowAvrResult) {
            const newPreamblevirtualEventKey = this.previousEvent.avr.virtualEventKey;
            BomUtilities.formatLog(
                'New Preamble Key: ' + newPreamblevirtualEventKey + '|| Previous Preamble Key: ' + this.previousPreamblevirtualEventKey,
            );
            if (this.previousPreamblevirtualEventKey != newPreamblevirtualEventKey) {
                this.log(
                    'Showing Avr Preamble Page' + ',' + 'virtualEventKey: ' + newPreamblevirtualEventKey,
                    'Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })),
                    LogType.Information,
                );
                const preambleTime = this.getNextPremableTimeOut();
                //this.preambleService.seconds = this.isHorseRace ? this.countdownHorse - this.delayTimeHorse : this.countdownDog - this.delayTimeDog;
                this.preambleService.seconds = preambleTime / 1000 + 2;
                this.preambleService.setPreambleTemplate(this.previousEvent);
                this.resultService.setViewerEventCardTemplate(this.previousEvent);
                this.videoService.setEventName(this.resultService?.avrResultPage?.eventName);
                this.videoService.setOverlay(this.isOverlay);
                this.avrState$.next(this.avrStates.ShowAvrPreamble);
                console.log('Current Time in BTC timezone: ' + new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })));
                this.getAvrPreambleTime(this.eventType);
            } else {
                //Continue to wait for next one second to get new preamble
                BomUtilities.formatLog(
                    'New Preamble Key: ' + newPreamblevirtualEventKey + '|| Previous Preamble Key: ' + this.previousPreamblevirtualEventKey,
                );
                this.showPageState(3);
            }
        }
    }

    getNextPremableTimeOut() {
        console.log(this.previousEvent);
        console.log(this.previousEvent.avr.eventDateTime);
        const eventDate = this.previousEvent.avr.eventDateTime?.split(' ')[0]?.split('/');
        const eventTime = this.previousEvent.avr.eventDateTime?.split(' ')[1]?.split(':');

        //Future time of event.
        const eventDateTime = new Date(
            Number.parseInt(eventDate[2]),
            Number.parseInt(eventDate[1]) - 1,
            Number.parseInt(eventDate[0]),
            Number.parseInt(eventTime[0]),
            Number.parseInt(eventTime[1]),
            Number.parseInt(eventTime[2]),
        );

        console.log('Future time of the Event: ' + eventDateTime);

        //Current time.
        const currentDateTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));

        console.log('Current time in BTC timezone: ' + currentDateTime);
        const preambleTime = eventDateTime.getTime() - currentDateTime.getTime();
        BomUtilities.formatLog('Preamble time in milliseconds subtracting future time - Current time: ' + preambleTime);
        return preambleTime;
    }

    setAvrCountDownTime(eventType: string) {
        const preambleTime = this.getNextPremableTimeOut() / 1000 + 2;
        this.preambleService.seconds = preambleTime;
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        console.log('Calculated preamble time for first race - Horses :' + (preambleTime + this.offTime));
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        console.log('Calculated preamble time for first race - JumpHorses :' + (preambleTime + this.offTime));
                        break;
                }
                break;
            case AvrEventTypeEnum.DogRace:
                console.log('Calculated preamble time for first race - Dogs :' + (preambleTime + this.offTime));
                break;
            case AvrEventTypeEnum.MotorRace:
                console.log('Calculated preamble time for first race - MotorRacing :' + (preambleTime + this.offTime));
                break;
        }
    }

    setShowPageState(eventType: string) {
        const pageDuration: number = this.preambleService.seconds;

        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        console.log('Showing Preamble for horse seconds: ' + (pageDuration + this.offTime));
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        console.log('Showing Preamble for JUMP horse seconds: ' + (pageDuration + this.offTime));
                        break;
                }
                break;
            case AvrEventTypeEnum.DogRace:
                console.log('Showing Preamble for dogs seconds: ' + (pageDuration + this.offTime));
                break;
            case AvrEventTypeEnum.MotorRace:
                console.log('Showing Preamble for motor seconds: ' + (pageDuration + this.offTime));
                break;
        }
        this.showPageState(pageDuration + this.offTime);
    }

    getAvrVideoTime(eventType: string) {
        let videoTime: number = this.videoTimeHorse;
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        console.log('Showing video for horse seconds: ' + this.videoTimeHorse);
                        videoTime = this.videoTimeHorse;
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        console.log('Showing video for JUMP horse seconds: ' + this.videoTimeJumpHorse);
                        videoTime = this.videoTimeJumpHorse;
                        break;
                }
                break;
            case AvrEventTypeEnum.DogRace:
                console.log('Showing video for dogs seconds: ' + this.videoTimeDog);
                videoTime = this.videoTimeDog;
                break;
            case AvrEventTypeEnum.MotorRace:
                console.log('Showing video for motor seconds: ' + this.videoTimeMotor);
                videoTime = this.videoTimeMotor;
                break;
        }
        this.showPageState(videoTime);
    }

    getAvrResultTime(eventType: string) {
        let resultTime: number = this.resultTimeHorse;
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        console.log('Showing Result for horse seconds: ' + this.resultTimeHorse);
                        resultTime = this.resultTimeHorse;
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        console.log('Showing Result for JUMP horse seconds: ' + this.resultTimeJumpHorse);
                        resultTime = this.resultTimeJumpHorse;
                        break;
                }
                break;
            case AvrEventTypeEnum.DogRace:
                console.log('Showing Result for dogs seconds: ' + this.resultTimeDog);
                resultTime = this.resultTimeDog;
                break;
            case AvrEventTypeEnum.MotorRace:
                console.log('Showing Result for motor seconds: ' + this.resultTimeMotor);
                resultTime = this.resultTimeMotor;
                break;
        }
        this.showPageState(resultTime);
    }

    getAvrPreambleTime(eventType: string) {
        let preambleTime: number = this.preambleService.seconds + this.offTime;
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        console.log('Showing Preamble for horse seconds: ' + (this.preambleService.seconds + this.offTime));
                        preambleTime = this.preambleService.seconds + this.offTime;
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        console.log('Showing Preamble for JUMP horse seconds: ' + (this.preambleService.seconds + this.offTime));
                        preambleTime = this.preambleService.seconds + this.offTime;
                        break;
                }
                break;
            case AvrEventTypeEnum.DogRace:
                console.log('Showing Preamble for dogs seconds: ' + (this.preambleService.seconds + this.offTime));
                preambleTime = this.preambleService.seconds + this.offTime;
                break;
            case AvrEventTypeEnum.MotorRace:
                console.log('Showing Preamble for motor seconds: ' + (this.preambleService.seconds + this.offTime));
                preambleTime = this.preambleService.seconds + this.offTime;
                break;
        }
        this.showPageState(preambleTime);
    }

    log(stateAndEventId: string, message: string, level: LogType = LogType.Error, status: string = '200', fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${stateAndEventId}: ${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
