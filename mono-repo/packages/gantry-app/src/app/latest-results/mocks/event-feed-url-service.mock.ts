import { Mock, StubObservable } from 'moxxi';

import { EventFeedUrlService } from '../../common/services/event-feed-url.service';

@Mock({ of: EventFeedUrlService })
export class EventFeedUrlServiceMock {
    @StubObservable() getLatestSixResultsContent: jasmine.ObservableSpy; //getHorseRacingContent
    @StubObservable() getEventFeedApiUrls: jasmine.ObservableSpy;
    @StubObservable() eventFeedApiUrls$: jasmine.ObservableSpy;
}
