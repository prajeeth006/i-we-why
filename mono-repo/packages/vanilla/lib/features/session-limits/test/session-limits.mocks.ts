import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { SessionLimitsOverlayService } from '../src/session-limits-overlay.service';
import { SessionLimitsTrackingService } from '../src/session-limits-tracking.service';
import { SessionLimitsConfig } from '../src/session-limits.client-config';

@Mock({ of: SessionLimitsConfig })
export class SessionLimitsConfigMock extends SessionLimitsConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: SessionLimitsOverlayService })
export class SessionLimitsOverlayServiceMock {
    @Stub() show: jasmine.Spy;
    @Stub() handlePendingLimits: jasmine.Spy;
}

@Mock({ of: SessionLimitsTrackingService })
export class SessionLimitsTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
    @Stub() trackClose: jasmine.Spy;
    @Stub() trackSessionLimitsEvent: jasmine.Spy;
    @Stub() trackSingleSessionLimitEvent: jasmine.Spy;
    @Stub() getLimitsType: jasmine.Spy;
}
