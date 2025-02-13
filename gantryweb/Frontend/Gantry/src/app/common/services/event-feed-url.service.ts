import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { EventFeedApiUrls } from '../models/event-feed-api-urls.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventFeedUrlService {

  eventFeedApiUrls$ = this.httpService.get<EventFeedApiUrls>('en/api/getEventFeedApiUrls').pipe(shareReplay());

  constructor(private httpService: HttpService) {
  }

}
