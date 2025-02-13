import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { ThirdPartyTrackingService } from '../src/third-party-tracking.service';

@Mock({ of: ThirdPartyTrackingService })
export class ThirdPartyTrackingServiceMock {
    trackingContent: BehaviorSubject<string> = new BehaviorSubject('');

    @Stub() enableTracker: jasmine.Spy;
}
