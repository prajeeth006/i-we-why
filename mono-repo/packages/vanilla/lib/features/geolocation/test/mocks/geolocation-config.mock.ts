import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { GeolocationConfig } from '../../src/geolocation.client-config';

@Mock({ of: GeolocationConfig })
export class GeolocationConfigMock extends GeolocationConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();
        this.minimumUpdateIntervalMilliseconds = 600;
        this.cookieExpirationMilliseconds = 700;
        this.watchOptions = { maximumAge: 12 };
        this.useBrowserGeolocation = true;
        this.watchBrowserPositionOnAppStart = false;
    }
}
