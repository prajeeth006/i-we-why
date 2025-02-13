import { Mock, Stub, StubPromise } from 'moxxi';

import { TrackingService } from '../tracking-core.service';

@Mock({ of: TrackingService })
export class TrackingServiceMock {
    @StubPromise() triggerEvent: jasmine.PromiseSpy;
    @Stub() addInitialValues: jasmine.Spy;
    @Stub() trackEvents: jasmine.Spy;
    @Stub() updateDataLayer: jasmine.Spy;
    @StubPromise() updateUserValues: jasmine.PromiseSpy;
    @Stub() reportError: jasmine.Spy;
    @Stub() reportErrorObject: jasmine.Spy;
    @Stub() setReferrer: jasmine.Spy;
    @Stub() trackContentItemEvent: jasmine.Spy;
    @Stub() updateUserContactabilityStatus: jasmine.Spy;
    event = { pageView: 'pageView', userLogout: 'Event.Logout', functionality: 'Event.Functionality' };
    @Stub() set: jasmine.Spy;
}
