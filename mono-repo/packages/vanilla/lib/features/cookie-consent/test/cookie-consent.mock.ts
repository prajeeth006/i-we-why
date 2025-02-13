import { Mock, Stub } from 'moxxi';

import { CookieConsentService } from '../src/cookie-consent.service';

@Mock({ of: CookieConsentService })
export class CookieConsentServiceMock {
    @Stub() tryShowCookieConsent: jasmine.Spy;
}
