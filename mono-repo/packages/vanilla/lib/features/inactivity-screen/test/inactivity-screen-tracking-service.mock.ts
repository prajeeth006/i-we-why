import { Mock, Stub, StubPromise } from 'moxxi';

import { InactivityScreenTrackingService } from '../src/inactivity-screen-tracking.service';

@Mock({ of: InactivityScreenTrackingService })
export class InactivityScreenTrackingServiceMock {
    @StubPromise() triggerEvent: jasmine.PromiseSpy;
    @StubPromise() trackLogin: jasmine.PromiseSpy;
    @StubPromise() trackLogout: jasmine.PromiseSpy;
    @Stub() trackShowOverlay: jasmine.Spy;
    @Stub() trackClick: jasmine.Spy;
    @Stub() trackSession: jasmine.Spy;
    @Stub() trackSessionClose: jasmine.Spy;
    @Stub() trackContinue: jasmine.Spy;
    @Stub() trackSessionOverlay: jasmine.Spy;
    @Stub() trackSessionOk: jasmine.Spy;
}
