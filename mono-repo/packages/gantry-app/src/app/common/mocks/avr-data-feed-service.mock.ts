import { Mock, Stub, StubObservable } from 'moxxi';

import { AvrDataFeedService } from '../services/data-feed/avr-service/avr-data-feed.service';

@Mock({ of: AvrDataFeedService })
export class AvrDataFeedServiceMock {
    @StubObservable() avrService$: jasmine.ObservableSpy;
    @StubObservable() data$: jasmine.ObservableSpy;
    @Stub() setControllerId: jasmine.Spy;
}
