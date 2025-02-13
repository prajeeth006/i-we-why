import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { LossLimitsOverlayService } from '../src/loss-limits-overlay.service';
import { LossLimitsConfig } from '../src/loss-limits.client-config';

@Mock({ of: LossLimitsConfig })
export class LossLimitsConfigMock extends LossLimitsConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: LossLimitsOverlayService })
export class LossLimitsOverlayServiceMock {
    @Stub() show: jasmine.Spy;
    @Stub() close: jasmine.Spy;
}
