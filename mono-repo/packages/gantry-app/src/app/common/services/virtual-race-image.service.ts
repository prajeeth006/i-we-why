import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, concatMap, of, shareReplay } from 'rxjs';

import { VirtualRaceSilkRunnerImageContent } from '../models/gantry-commom-content.model';
import { EventAndMeetingTypes } from '../models/general-codes-model';
import { HttpService } from './http.service';
import { Log, LogType, LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualRaceImageService {
    private virtualSildImageDataSubject = new BehaviorSubject<EventAndMeetingTypes>(new EventAndMeetingTypes());

    getVirtualRaceSilksRunnerImageContent(meetingName: string, eventName: string, eventType: string) {
        return this.httpService.get<VirtualRaceSilkRunnerImageContent>(
            'en/api/getVirtualRaceSilksRunnerImageContent',
            new HttpParams().set('meetingName', meetingName).set('eventType', eventType).set('eventName', eventName),
        );
    }

    runnerImage$ = this.virtualSildImageDataSubject.pipe(
        concatMap((eventAndMeetingTypes: EventAndMeetingTypes) => {
            if (!!eventAndMeetingTypes?.meetingName && !!eventAndMeetingTypes?.eventName && !!eventAndMeetingTypes?.eventType) {
                return this.getVirtualRaceSilksRunnerImageContent(
                    eventAndMeetingTypes.meetingName,
                    eventAndMeetingTypes.eventName,
                    eventAndMeetingTypes.eventType,
                );
            } else if (eventAndMeetingTypes?.meetingName) {
                return this.getVirtualRaceSilksRunnerImageContent(
                    eventAndMeetingTypes.meetingName,
                    eventAndMeetingTypes.eventName,
                    eventAndMeetingTypes.eventType,
                );
            }
            return of(new VirtualRaceSilkRunnerImageContent());
        }),
        shareReplay(),
    );

    constructor(
        private httpService: HttpService,
        private loggerService: LoggerService,
    ) {}

    setEventAndMeetingName(eventType: string, meetingName: string, eventName: string = '') {
        this.virtualSildImageDataSubject.next({
            eventType: eventType,
            meetingName: meetingName,
            eventName: eventName,
        });
    }

    logError(message: string) {
        const errorLog: Log = {
            level: LogType.Error,
            message: 'Could not load the url because ' + message,
            status: '404',
            fatal: false,
        };
        this.loggerService.log(errorLog);
    }
}
