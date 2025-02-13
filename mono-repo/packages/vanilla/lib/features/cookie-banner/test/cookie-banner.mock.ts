import { Mock, Stub } from 'moxxi';

import { CookieBannerService } from '../src/cookie-banner.service';

@Mock({ of: CookieBannerService })
export class CookieBannerServiceMock {
    @Stub() setOptanonGroupCookie: jasmine.Spy;
}
