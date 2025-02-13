import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { SessionLimitsLogoutPopupConfig } from '../src/session-limits-logout-popup.client-config';
import { SessionLimitsLogoutPopupService } from '../src/session-limits-logout-popup.service';

@Mock({ of: SessionLimitsLogoutPopupConfig })
export class SessionLimitsLogoutPopupConfigMock extends SessionLimitsLogoutPopupConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: SessionLimitsLogoutPopupService })
export class SessionLimitsLogoutPopupServiceMock {
    @Stub() show: jasmine.Spy;
}
