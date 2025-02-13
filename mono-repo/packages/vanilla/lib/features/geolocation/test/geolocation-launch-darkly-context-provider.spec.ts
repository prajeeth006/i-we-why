import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { GeolocationPosition, MappedGeolocation } from '../../../core/src/lazy/service-providers/geolocationposition';
import { GeolocationContextProvider } from '../src/geolocation-launch-darkly-context-provider';
import { GeolocationServiceMock } from './mocks';

describe('GeolocationContextProvider', () => {
    let target: GeolocationContextProvider;
    let geolocationServiceMock: GeolocationServiceMock;

    beforeEach(() => {
        geolocationServiceMock = MockContext.useMock(GeolocationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationContextProvider],
        });
        geolocationServiceMock.currentPosition = {
            mappedLocation: { stateClient: 'ny', countryClient: 'us' } as MappedGeolocation,
        } as GeolocationPosition;
        target = TestBed.inject(GeolocationContextProvider);
    });

    it('should return geolocation object', fakeAsync(() => {
        const result = target.getLazyContext();
        geolocationServiceMock.positionChanges.next({} as GeolocationPosition);
        tick();
        result.then((p) => {
            expect(p).toEqual({
                kind: 'multi',
                state: { key: 'ny' },
                country: { key: 'us' },
            });
        });
    }));
});
