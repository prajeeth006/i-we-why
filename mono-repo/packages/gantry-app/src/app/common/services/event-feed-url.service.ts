import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { EventFeedApiUrls } from '../models/event-feed-api-urls.model';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class EventFeedUrlService {
    eventFeedApiUrls$ = this.httpService.get<EventFeedApiUrls>('en/api/getEventFeedApiUrls').pipe(shareReplay());

    constructor(private httpService: HttpService) {}
}
