import { Mock, StubObservable } from 'moxxi';

import { AvrResultService } from '../../avr/services/avr-result.service';

@Mock({ of: AvrResultService })
export class AvrResultServiceMock {
    @StubObservable() avrService$: jasmine.ObservableSpy;
    @StubObservable() data$: jasmine.ObservableSpy;
}
