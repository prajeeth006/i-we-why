import { Mock, Stub } from 'moxxi';

import { LossLimitsTrackingService } from '../src/loss-limit-tracking-service';

@Mock({ of: LossLimitsTrackingService })
export class LossLimitsTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
    @Stub() trackClose: jasmine.Spy;
    @Stub() trackLossLimitsEvent: jasmine.Spy;
}
