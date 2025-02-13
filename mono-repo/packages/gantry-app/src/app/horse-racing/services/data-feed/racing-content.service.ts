import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, concatMap, map, of, scan, shareReplay } from 'rxjs';

import { QueryParamEvent } from '../../../common/models/query-param.model';
import { SisData } from '../../../common/models/sis-model';
import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';
import { EventSourceDataFeedService } from '../../../common/services/event-source-data-feed.service';
import { RacingContentResult } from '../../models/data-feed/racing-content.model';

@Injectable({
    providedIn: 'root',
})
export class RacingContentService {
    private eventSubject = new BehaviorSubject<QueryParamEvent | null>(null);
    private event$ = this.eventSubject.asObservable();
    private isVirtualSubject = new BehaviorSubject<boolean | null>(null);
    private isVirtual$ = this.isVirtualSubject.asObservable();

    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

    data$ = combineLatest([this.event$, this.eventFeedApiUrls$, this.isVirtual$]).pipe(
        concatMap(([event, eventFeedApiUrls, isVirtual]) => {
            const url = `${eventFeedApiUrls.racingContentEventsApi}${event?.key}`;
            this.eventSourceDataFeedService.apiKeyName.next('');

            if (isVirtual == null || isVirtual == true) return of(new RacingContentResult());

            return this.eventSourceDataFeedService.getServerSentEvent(url, false, 0, false).pipe(
                map((dataString) => {
                    const parsedData = JSON.parse(dataString);
                    let horseRacingContent: RacingContentResult = new RacingContentResult();
                    horseRacingContent.hasRacingContent = !(parsedData.status === 404);
                    if (parsedData.racingContent) {
                        horseRacingContent = parsedData.racingContent;
                    } else if (parsedData.racingContentAddendum) {
                        const sisData: SisData = parsedData.racingContentAddendum;
                        horseRacingContent.sisData = sisData;
                    }
                    return horseRacingContent;
                }),
                scan((racingContentResultSum: RacingContentResult, racingContentResultNew: RacingContentResult) => {
                    racingContentResultSum = { ...racingContentResultSum, ...racingContentResultNew };
                    return racingContentResultSum;
                }),
            );
        }),
        shareReplay(),
    );

    constructor(
        private eventFeedUrlService: EventFeedUrlService,
        private eventSourceDataFeedService: EventSourceDataFeedService,
    ) {}

    setEvent(event: QueryParamEvent) {
        this.eventSubject.next(event);
    }

    setIsVirtual(isVirtual: boolean) {
        if (isVirtual != this.isVirtualSubject.value) {
            this.isVirtualSubject.next(isVirtual);
        }
    }
}
