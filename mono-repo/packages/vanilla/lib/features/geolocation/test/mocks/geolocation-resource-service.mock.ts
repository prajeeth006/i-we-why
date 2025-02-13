import { Mock, StubObservable } from 'moxxi';

import { GeolocationResourceService } from '../../src/geolocation-resource.service';

@Mock({ of: GeolocationResourceService })
export class GeolocationResourceServiceMock {
    @StubObservable() mapGeolocation: jasmine.ObservableSpy;
}
