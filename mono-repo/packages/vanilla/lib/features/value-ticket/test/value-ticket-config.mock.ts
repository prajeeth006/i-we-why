import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ValueTicketConfig } from '../src/value-ticket.client-config';
import { ValueTicketStatus } from '../src/value-ticket.models';

@Mock({ of: ValueTicketConfig })
export class ValueTicketConfigMock extends ValueTicketConfig {
    override whenReady = new Subject<void>();
    override overlays = [{ messages: { status: ValueTicketStatus.SCANNED } }, { messages: { status: ValueTicketStatus.BLOCKED } }];
}
