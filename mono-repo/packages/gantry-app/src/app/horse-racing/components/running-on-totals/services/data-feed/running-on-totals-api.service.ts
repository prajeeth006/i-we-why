import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, concatMap, shareReplay } from 'rxjs';

import { QueryParamEvent } from '../../../../../common/models/query-param.model';
import { EventFeedUrlService } from '../../../../../common/services/event-feed-url.service';
import { RunningOnTotalsResultsService } from './running-on-totals-results.service';

@Injectable({
    providedIn: 'root',
})
export class RunningOnTotalsApiService {
    private typeSubject = new BehaviorSubject<QueryParamEvent | null>(null);
    private type$ = this.typeSubject.asObservable();
    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

    constructor(
        private eventFeedUrlService: EventFeedUrlService,
        private runningOnTotalsResultsService: RunningOnTotalsResultsService,
    ) {}

    data$ = combineLatest([this.type$, this.eventFeedApiUrls$]).pipe(
        concatMap(([type, eventFeedApiUrls]) => {
            const url = `${eventFeedApiUrls.runningOnTotalsApi}${type}`;
            this.runningOnTotalsResultsService.setUrl(url, eventFeedApiUrls.snapShotDataTimeOut);
            return this.runningOnTotalsResultsService.data$;
        }),
        shareReplay(),
    );

    setTypeId(typeId: QueryParamEvent) {
        this.typeSubject.next(typeId);
    }
}
