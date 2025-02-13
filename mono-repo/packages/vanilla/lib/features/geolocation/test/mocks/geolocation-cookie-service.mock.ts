import { Mock, Stub } from 'moxxi';

import { GeolocationCookieService } from '../../src/geolocation-cookie.service';

@Mock({ of: GeolocationCookieService })
export class GeolocationCookieServiceMock {
    @Stub() read: jasmine.Spy;
    @Stub() write: jasmine.Spy;
    @Stub() delete: jasmine.Spy;
}
