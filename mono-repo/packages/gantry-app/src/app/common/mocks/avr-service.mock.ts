import { Mock, StubObservable } from 'moxxi';

import { AvrService } from '../../avr/services/avr.service';

@Mock({ of: AvrService })
export class AvrServiceMock {
    @StubObservable() avrDataFeed$: jasmine.ObservableSpy;
    @StubObservable() avr$: jasmine.ObservableSpy;
}
