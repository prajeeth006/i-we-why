import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest, concatMap, map, scan, shareReplay } from 'rxjs';

import { WindowHelper } from '../../../../common/helpers/window-helper/window-helper';
import { DataFeedApiNames } from '../../../../common/models/data-feed-authentication.model';
import { AvrResult, AvrTempResult } from '../../../../common/models/data-feed/avr.model';
import { QueryParamEvent } from '../../../../common/models/query-param.model';
import { EventSourceDataFeedService } from '../../../../common/services/event-source-data-feed.service';
import { EventFeedUrlService } from '../../event-feed-url.service';
import { Log, LogType, LoggerService } from '../../logger.service';

@Injectable({
    providedIn: 'root',
})
export class AvrDataFeedService {
    private eventSubject = new BehaviorSubject<QueryParamEvent | null>(null);
    private event$ = this.eventSubject.asObservable();
    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

    private urlSubject = new BehaviorSubject<string>('');
    constructor(
        private eventSourceDataFeedService: EventSourceDataFeedService,
        private eventFeedUrlService: EventFeedUrlService,
        private _windowHelper: WindowHelper,
        private loggerService: LoggerService,
    ) {}

    avrService$ = this.eventFeedApiUrls$.pipe(
        concatMap((eventFeedApiUrls) => {
            const url = `${eventFeedApiUrls.avrApi}${this.eventSubject.getValue()?.key}`;
            this.eventSourceDataFeedService.apiKeyName.next(DataFeedApiNames.AvrApi);

            return this.eventSourceDataFeedService.getServerSentEvent(url, true, 0, false).pipe(
                (dataString) => {
                    try {
                        return dataString.pipe(
                            map((dataString) => {
                                const parsedData = JSON.parse(dataString);
                                const tempResult = new AvrTempResult();

                                if (parsedData.avr) {
                                    const result: AvrResult = Object.assign(new AvrResult(), parsedData);
                                    this.log(
                                        `Got AVR data from DF, virtualEventKey: ${result?.avr?.virtualEventKey}, MessageType: ${
                                            result?.avr?.meta?.messageType
                                        }, Current Time in BTC timezone: ${new Date(
                                            new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }),
                                        )}`,
                                    );
                                    tempResult.newItem = result;
                                }
                                return tempResult;
                            }),
                        );
                    } catch (error) {
                        console.error(error);
                        this.log(`Error in processing data from AVR ${error}`, LogType.Error, '500', true);
                    }
                    return new Observable<AvrTempResult>();
                },
                scan((tempResultSum: AvrTempResult, newTempResult: AvrTempResult) => {
                    if (newTempResult.newItem instanceof AvrResult) {
                        const newMeetingResult = newTempResult.newItem;
                        tempResultSum.messageMap.messageTypes?.clear();
                        if (!!newMeetingResult?.avr && newMeetingResult?.avr?.meta?.messageType) {
                            tempResultSum.messageMap.messageTypes.set(newMeetingResult?.avr?.meta?.messageType?.toUpperCase(), newMeetingResult);
                        }

                        if (!tempResultSum.result.eventIds.has(Number(newMeetingResult.avr?.eventId))) {
                            tempResultSum.result.eventIds.clear();
                        }
                        tempResultSum.result.eventIds.set(Number(newMeetingResult.avr?.eventId), tempResultSum.messageMap);
                    }
                    return tempResultSum;
                }, new AvrTempResult()),
                map((meetingResult: AvrTempResult) => {
                    this._windowHelper.raiseEventToElectron();
                    return meetingResult.result;
                }),
                shareReplay(),
            );
        }),
    );

    data$ = combineLatest([this.event$, this.eventFeedApiUrls$]).pipe(
        concatMap(([event, eventFeedApiUrls]) => {
            const url = `${eventFeedApiUrls.avrApi}${event?.key}`;
            this.setUrl(url);
            return this.avrService$;
        }),
    );

    setUrl(url: string) {
        this.urlSubject.next(url);
    }

    setControllerId(controllerId: QueryParamEvent) {
        this.eventSubject.next(controllerId);
    }

    log(message: string, level: LogType = LogType.Information, status: string = '200', fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
