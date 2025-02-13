import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, concatMap, shareReplay } from 'rxjs';

import { QueryParamEvent } from '../../../../common/models/query-param.model';
import { EventFeedUrlService } from '../../event-feed-url.service';
import { EventSourceDataFeedService } from '../../event-source-data-feed.service';
import { CommonResultsService } from '../common-results.service';

@Injectable({
    providedIn: 'root',
})
export class EventResultService {
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
            const url = `${eventFeedApiUrls.eventsResultApi}${event?.key}`;
            this.eventSourceDataFeedService.apiKeyName.next('');
            this.commonResultsService.setUrl(url, 0, false);
            return this.commonResultsService.data$;
        }),
        shareReplay(),
    );

    setEventId(eventId: QueryParamEvent) {
        this.eventSubject.next(eventId);
    }
}
