import { Mock, Stub } from 'moxxi';

import { GeolocationDslResolver } from '../../src/geolocation-dsl-resolver';

@Mock({ of: GeolocationDslResolver })
export class GeolocationDslResolverMock {
    @Stub() getPosition: jasmine.Spy;
    @Stub() getLocation: jasmine.Spy;
    @Stub() hasPosition: jasmine.Spy;
}
