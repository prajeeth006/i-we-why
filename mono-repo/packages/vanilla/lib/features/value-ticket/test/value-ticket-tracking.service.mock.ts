import { Mock, Stub, StubPromise } from 'moxxi';

import { ValueTicketTrackingService } from '../src/value-ticket-tracking.service';

@Mock({ of: ValueTicketTrackingService })
export class ValueTicketTrackingServiceMock {
    @StubPromise() triggerEvent: jasmine.PromiseSpy;
    @Stub() trackBlockTicketOverlayDisplay: jasmine.Spy;
    @Stub() trackBlockTicketOverlayClickEvent: jasmine.Spy;
    @Stub() trackScanTicketOverlayDisplay: jasmine.Spy;
    @Stub() trackScanTicketOverlayClickEvent: jasmine.Spy;
}
