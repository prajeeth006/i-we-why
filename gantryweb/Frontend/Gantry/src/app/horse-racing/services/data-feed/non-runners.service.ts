import { Injectable } from '@angular/core';
import { concatMap, map, scan, shareReplay } from 'rxjs';
import { EventFeedUrlService } from 'src/app/common/services/event-feed-url.service';
import { EventSourceDataFeedService } from 'src/app/common/services/event-source-data-feed.service';
import { NonRunnersResult } from '../../models/data-feed/non-runners.model';

@Injectable({
  providedIn: 'root'
})
export class NonRunnersService {

  data$ = this.eventFeedUrlService.eventFeedApiUrls$
  .pipe(
    concatMap((eventFeedApiUrls) => {
      let url = `${eventFeedApiUrls.nonRunnersApi}`;

      return this.eventSourceDataFeedService.getServerSentEvent(url, true, 0, false)
      .pipe(
        map(dataString => {
          let parsedData = JSON.parse(dataString);
          let result: NonRunnersResult = parsedData;
          return result;
        }),
        scan((nonRunnersSum: NonRunnersResult, nonRunnersNew: NonRunnersResult) => {
          nonRunnersSum = { ...nonRunnersSum, ...nonRunnersNew };
          return nonRunnersSum;
        })
      );
    }),
    shareReplay()
  );

  constructor(
    private eventFeedUrlService: EventFeedUrlService,
    private eventSourceDataFeedService: EventSourceDataFeedService
  ) { }

}
