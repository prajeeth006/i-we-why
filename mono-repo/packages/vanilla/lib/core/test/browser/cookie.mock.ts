import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { CookieService } from '../../src/browser/cookie/cookie.service';
import { TopLevelCookiesConfig } from '../../src/client-config/top-level-cookies.client-config';

@Mock({ of: CookieService })
export class CookieServiceMock {
    @Stub() get: jasmine.Spy;
    @Stub() getAll: jasmine.Spy;
    @Stub() getObject: jasmine.Spy;
    @Stub() getQueryCollection: jasmine.Spy;
    @Stub() put: jasmine.Spy;
    @Stub() putRaw: jasmine.Spy;
    @Stub() putObject: jasmine.Spy;
    @Stub() addToQueryCollection: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() removeAll: jasmine.Spy;
}

@Mock({ of: TopLevelCookiesConfig })
export class TopLevelCookiesConfigMock extends TopLevelCookiesConfig {
    override whenReady = new Subject<void>();
}
