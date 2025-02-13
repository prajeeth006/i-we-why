import { Position } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { GeolocationBrowserApiService } from '../../src/geolocation-browser-api.service';

@Mock({ of: GeolocationBrowserApiService })
export class GeolocationBrowserApiServiceMock {
    positionChanges = new Subject<Position>();
}
