import { Injectable } from '@angular/core';

import { concatMap, map, scan, shareReplay } from 'rxjs';

import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';
import { EventSourceDataFeedService } from '../../../common/services/event-source-data-feed.service';
import { NonRunnersResult } from '../../models/data-feed/non-runners.model';

@Injectable({
    providedIn: 'root',
})
export class NonRunnersService {
    data$ = this.eventFeedUrlService.eventFeedApiUrls$.pipe(
        concatMap((eventFeedApiUrls) => {
            const url = `${eventFeedApiUrls.nonRunnersApi}`;
            this.eventSourceDataFeedService.apiKeyName.next('');

            return this.eventSourceDataFeedService.getServerSentEvent(url, true, 0, false).pipe(
                map((dataString) => {
                    const parsedData = JSON.parse(dataString);
                    const result: NonRunnersResult = parsedData;
                    return result;
                }),
                scan((nonRunnersSum: NonRunnersResult, nonRunnersNew: NonRunnersResult) => {
                    nonRunnersSum = { ...nonRunnersSum, ...nonRunnersNew };
                    return nonRunnersSum;
                }),
            );
        }),
        shareReplay(),
    );

    constructor(
        private eventFeedUrlService: EventFeedUrlService,
        private eventSourceDataFeedService: EventSourceDataFeedService,
    ) {}
}
