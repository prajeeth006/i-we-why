import { Mock, Stub } from 'moxxi';

import { UrlService } from '../../src/navigation/url.service';

@Mock({ of: UrlService })
export class UrlServiceMock {
    @Stub() parse: jasmine.Spy;
    @Stub() current: jasmine.Spy;
    @Stub() appendReferrer: jasmine.Spy;
    @Stub() isAbsolute: jasmine.Spy;
    culturePattern: string;
}
