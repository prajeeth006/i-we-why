import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, concatMap, map, of, scan, shareReplay } from 'rxjs';

import { QueryParamEvent } from '../../../common/models/query-param.model';
import { SisData } from '../../../common/models/sis-model';
import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';
import { EventSourceDataFeedService } from '../../../common/services/event-source-data-feed.service';
import { RacingContentGreyhoundResult } from '../../models/racing-content.model';

@Injectable({
    providedIn: 'root',
})
export class RacingContentGreyhoundService {
    private eventSubject = new BehaviorSubject<QueryParamEvent | null>(null);
    private event$ = this.eventSubject.asObservable();
    private isVirtualSubject = new BehaviorSubject<boolean | null>(null);
    private isVirtual$ = this.isVirtualSubject.asObservable();

    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

    data$ = combineLatest([this.event$, this.eventFeedApiUrls$, this.isVirtual$]).pipe(
        concatMap(([event, eventFeedApiUrls, isVirtual]) => {
            const url = `${eventFeedApiUrls.racingContentEventsApi}${event?.key}`;
            this.eventSourceDataFeedService.apiKeyName.next(null);

            if (isVirtual == null || isVirtual == true) return of(new RacingContentGreyhoundResult());

            return this.eventSourceDataFeedService.getServerSentEvent(url, false, 0, false).pipe(
                map((dataString) => {
                    const parsedData = JSON.parse(dataString);
                    let greyhoundRacingContent: RacingContentGreyhoundResult = new RacingContentGreyhoundResult();
                    if (parsedData.racingContent) {
                        greyhoundRacingContent = parsedData.racingContent;
                    } else {
                        const sisData: SisData = parsedData.racingContentAddendum;
                        greyhoundRacingContent.sisData = sisData;
                    }
                    return greyhoundRacingContent;
                }),
                scan((greyhoundRacingContentSum: RacingContentGreyhoundResult, greyhoundRacingContentNew: RacingContentGreyhoundResult) => {
                    greyhoundRacingContentSum = { ...greyhoundRacingContentSum, ...greyhoundRacingContentNew };
                    return greyhoundRacingContentSum;
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
