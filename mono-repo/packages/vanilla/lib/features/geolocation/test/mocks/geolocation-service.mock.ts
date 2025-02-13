import { GeolocationPosition, GeolocationService as PublicGeolocationService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { GeolocationService } from '../../src/geolocation.service';

@Mock({ of: GeolocationService })
export class GeolocationServiceMock {
    currentPosition: GeolocationPosition | null;
    positionChanges = new Subject<GeolocationPosition>();
    @Stub() watchNativePositionChanges: jasmine.Spy;
    @Stub() restoreLastPositionFromCookie: jasmine.Spy;
    @Stub() watchBrowserPositionChanges: jasmine.Spy;
    @Stub() clearPositionForGood: jasmine.Spy;
}

@Mock({ of: PublicGeolocationService })
export class PublicGeolocationServiceMock {
    whenReady: Subject<void> = new Subject();
    currentPosition: GeolocationPosition | null;
    positionChanges = new Subject<GeolocationPosition>();
    @Stub() watchBrowserPositionChanges: jasmine.Spy;
}
