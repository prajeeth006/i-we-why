import { Mock, Stub } from 'moxxi';

import { ValueTicketService } from '../src/value-ticket.service';

@Mock({ of: ValueTicketService })
export class ValueTicketServiceMock {
    @Stub() init: jasmine.Spy;
    @Stub() showOverlay: jasmine.Spy;
}
