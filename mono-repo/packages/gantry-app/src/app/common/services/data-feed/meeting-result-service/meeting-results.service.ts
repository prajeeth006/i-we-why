import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, concatMap } from 'rxjs';

import { QueryParamEvent } from '../../../../common/models/query-param.model';
import { EventFeedUrlService } from '../../event-feed-url.service';
import { EventSourceDataFeedService } from '../../event-source-data-feed.service';
import { CommonResultsService } from '../common-results.service';

@Injectable({
    providedIn: 'root',
})
export class MeetingResultsService {
    private eventSubject = new BehaviorSubject<QueryParamEvent | null>(null);
    private event$ = this.eventSubject.asObservable();
    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

    constructor(
        private eventFeedUrlService: EventFeedUrlService,
        private commonResultsService: CommonResultsService,
        private eventSourceDataFeedService: EventSourceDataFeedService,
    ) {}

    data$ = combineLatest([this.event$, this.eventFeedApiUrls$]).pipe(
        concatMap(([event, eventFeedApiUrls]) => {
            const url = `${eventFeedApiUrls.meetingResultsApi}${event?.key}`;
            this.eventSourceDataFeedService.apiKeyName.next('');
            this.commonResultsService.setUrl(url, eventFeedApiUrls.snapShotDataTimeOut);
            return this.commonResultsService.data$;
        }),
    );

    setTypeId(typeId: QueryParamEvent) {
        this.eventSubject.next(typeId);
    }
}
