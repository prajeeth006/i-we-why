import { Mock, StubObservable } from 'moxxi';

import { EventFeedUrlService } from '../services/event-feed-url.service';

@Mock({ of: EventFeedUrlService })
export class EventFeedUrlServiceMock {
    @StubObservable() getHorseRacingContent: jasmine.ObservableSpy;
    @StubObservable() getEventFeedApiUrls: jasmine.ObservableSpy;
    @StubObservable() eventFeedApiUrls$: jasmine.ObservableSpy;
}
