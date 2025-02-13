import { Mock, StubObservable } from 'moxxi';

import { ValueTicketResourceService } from '../src/value-ticket-resource.service';

@Mock({ of: ValueTicketResourceService })
export class ValueTicketResourceServiceMock {
    @StubObservable() getValueTicket: jasmine.ObservableSpy;
    @StubObservable() payoutValueTicket: jasmine.ObservableSpy;
}
