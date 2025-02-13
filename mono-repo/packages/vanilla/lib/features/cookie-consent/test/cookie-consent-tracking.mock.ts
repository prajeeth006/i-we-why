import { Mock, Stub } from 'moxxi';

import { CookieConsentTrackingService } from '../src/cookie-consent-tracking.service';

@Mock({ of: CookieConsentTrackingService })
export class CookieConsentTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
    @Stub() trackAccept: jasmine.Spy;
}
