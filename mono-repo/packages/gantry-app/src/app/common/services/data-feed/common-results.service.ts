import { Injectable } from '@angular/core';

import { BehaviorSubject, concatMap, map, scan, shareReplay } from 'rxjs';

import { EventSourceDataFeedService } from '../../../common/services/event-source-data-feed.service';
import { MeetingResultContent, MeetingTempResult } from '../../models/data-feed/meeting-results.model';

@Injectable({
    providedIn: 'root',
})
export class CommonResultsService {
    private urlSubject = new BehaviorSubject<any[]>([]);

    constructor(private eventSourceDataFeedService: EventSourceDataFeedService) {}

    data$ = this.urlSubject.pipe(
        concatMap((url) => {
            return this.eventSourceDataFeedService.getServerSentEvent(url[0], true, url[1], url[2]).pipe(
                (dataString) => {
                    return dataString.pipe(
                        map((dataString) => {
                            const parsedData = JSON.parse(dataString);
                            const tempResult = new MeetingTempResult();

                            if (parsedData.resultingContent) {
                                const resultingContent: MeetingResultContent = Object.assign(new MeetingResultContent(), parsedData);
                                tempResult.newItem = resultingContent;
                            }
                            return tempResult;
                        }),
                    );
                },
                scan((tempResultSum: MeetingTempResult, newTempResult: MeetingTempResult) => {
                    if (newTempResult.newItem instanceof MeetingResultContent) {
                        const newMeetingResult = newTempResult.newItem;
                        if (!!newMeetingResult && !!newMeetingResult.resultingContent?.eventId) {
                            tempResultSum.result.types.set(newMeetingResult.resultingContent?.eventId, newMeetingResult);
                        }
                    }
                    return tempResultSum;
                }, new MeetingTempResult()),
                map((meetingResult: MeetingTempResult) => meetingResult.result),
                shareReplay(),
            );
        }),
    );

    setUrl(url: string, snapShotDataTimeOut?: number, checkForSnapShot?: boolean) {
        this.urlSubject.next([url, snapShotDataTimeOut, checkForSnapShot]);
    }
}
