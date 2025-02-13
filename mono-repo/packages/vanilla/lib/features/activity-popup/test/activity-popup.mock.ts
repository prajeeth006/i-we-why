import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { ActivityPopupCookieService } from '../src/activity-popup-cookie.service';
import { ActivityPopupOverlayService } from '../src/activity-popup-overlay.service';
import { ActivityPopupTrackingService } from '../src/activity-popup-tracking.service';
import { ActivityPopupConfig } from '../src/activity-popup.client-config';
import { ActivityPopupService } from '../src/activity-popup.service';

@Mock({ of: ActivityPopupConfig })
export class ActivityPopupConfigMock extends ActivityPopupConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: ActivityPopupService })
export class ActivityPopupServiceMock {
    @Stub() setTimer: jasmine.Spy;
}

@Mock({ of: ActivityPopupCookieService })
export class ActivityPopupCookieServiceMock {
    @Stub() read: jasmine.Spy;
    @Stub() write: jasmine.Spy;
}

@Mock({ of: ActivityPopupOverlayService })
export class ActivityPopupOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}

@Mock({ of: ActivityPopupTrackingService })
export class ActivityPopupTrackingServiceMock {
    @Stub() load: jasmine.Spy;
    @Stub() continue: jasmine.Spy;
    @Stub() logout: jasmine.Spy;
}
