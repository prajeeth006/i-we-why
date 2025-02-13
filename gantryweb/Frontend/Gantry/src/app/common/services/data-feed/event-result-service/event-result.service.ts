import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concatMap, shareReplay } from 'rxjs';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { EventFeedUrlService } from '../../event-feed-url.service';
import { CommonResultsService } from '../common-results.service';

@Injectable({
  providedIn: 'root'
})
export class EventResultService {
  private eventSubject = new BehaviorSubject<QueryParamEvent>(null);
  private event$ = this.eventSubject.asObservable();
  private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

  constructor(private eventFeedUrlService: EventFeedUrlService,
    private commonResultsService: CommonResultsService) { }

  data$ = combineLatest([
    this.event$,
    this.eventFeedApiUrls$
  ]).pipe(
      concatMap(([event, eventFeedApiUrls]) => {
        let url = `${eventFeedApiUrls.eventsResultApi}${event.key}`;
        this.commonResultsService.setUrl(url, 0, false);
        return this.commonResultsService.data$;
      }),
      shareReplay()
    );

  setEventId(eventId: QueryParamEvent) {
    this.eventSubject.next(eventId);
  }
}
