import { Mock, StubObservable } from 'moxxi';

import { EventSourceDataFeedService } from '../services/event-source-data-feed.service';

@Mock({ of: EventSourceDataFeedService })
export class EventSourceDataFeedServiceMock {
    @StubObservable() getQueryParams: jasmine.ObservableSpy;
}
