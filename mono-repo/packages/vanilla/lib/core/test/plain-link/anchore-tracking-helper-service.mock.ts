import { Mock, Stub } from 'moxxi';

import { AnchorTrackingHelperService } from '../../src/plain-link/anchor-tracking-helper-service';

@Mock({ of: AnchorTrackingHelperService })
export class AnchorTrackingHelperServiceMock {
    @Stub() createTrackingData: jasmine.Spy;
    @Stub() getTrackingEventName: jasmine.Spy;
}
