import { TestBed } from '@angular/core/testing';

import { DateTimeOffset, DslRecorderService, GeolocationPosition, TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { DslTimeConverterServiceMock } from '../../../core/test/dsl/value-providers/dsl-time-converter.service.mock';
import { GeolocationDslValuesProvider } from '../src/geolocation-dsl-values-provider';
import { GeolocationDslResolverMock, GeolocationServiceMock } from './mocks';

describe('GeolocationDslValuesProvider', () => {
    let dslCacheServiceMock: DslCacheServiceMock;
    let dslTimeConverterMock: DslTimeConverterServiceMock;
    let geolocationServiceMock: GeolocationServiceMock;
    let geolocationDslResolverMock: GeolocationDslResolverMock;

    const position: GeolocationPosition = {
        timestamp: 123456789,
        coords: {
            latitude: 1,
            longitude: 2,
            altitude: 3,
            accuracy: 4,
            altitudeAccuracy: 5,
            heading: 6,
            speed: 7,
        },
        mappedLocation: {
            locationId: 'a',
            locationName: 'b',
            city: 'c',
            state: 'd',
            zip: 'e',
            country: 'f',
            cityClient: 'g',
            countryClient: 'h',
            locationNameClient: 'i',
            postCodeClient: 'j',
            stateClient: 'h',
        },
    };

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        dslTimeConverterMock = MockContext.useMock(DslTimeConverterServiceMock);
        geolocationServiceMock = MockContext.useMock(GeolocationServiceMock);
        geolocationDslResolverMock = MockContext.useMock(GeolocationDslResolverMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, GeolocationDslValuesProvider],
        });
        TestBed.inject(DslRecorderService).beginRecording();
    });

    function getTarget(): any {
        return TestBed.inject(GeolocationDslValuesProvider).getProviders()['Geolocation'];
    }

    describe('HasPosition', () => {
        runTest('should return true if there is a position', true);
        runTest('should return false if no position', false);

        function runTest(testName: string, hasPosition: boolean) {
            it(testName, () => {
                geolocationDslResolverMock.hasPosition.and.returnValue(hasPosition);
                expect(getTarget()['HasPosition']).toBe(hasPosition); // act
            });
        }
    });

    runPositionTest('Timestamp', 777, () =>
        dslTimeConverterMock.fromTimeToDsl.withArgs(new DateTimeOffset(position.timestamp, TimeSpan.ZERO)).and.returnValue(777),
    );

    runPositionTest('Latitude', position.coords.latitude);
    runPositionTest('Longitude', position.coords.longitude);
    runPositionTest('Altitude', position.coords.altitude);
    runPositionTest('Accuracy', position.coords.accuracy);
    runPositionTest('AltitudeAccuracy', position.coords.altitudeAccuracy);
    runPositionTest('Heading', position.coords.heading);
    runPositionTest('Speed', position.coords.speed);

    runLocationTest('LocationId', position.mappedLocation!.locationId);
    runLocationTest('LocationName', position.mappedLocation!.locationName);
    runLocationTest('City', position.mappedLocation!.city);
    runLocationTest('State', position.mappedLocation!.state);
    runLocationTest('Zip', position.mappedLocation!.zip);
    runLocationTest('Country', position.mappedLocation!.country);

    function runPositionTest(property: string, expectedPropertyValue: number | null, setup?: () => void) {
        it(`${property} should get from position`, () => {
            geolocationDslResolverMock.getPosition.and.returnValue(666);
            if (setup) setup();

            const result = getTarget()[property]; // act

            expect(result).toBe(666);
            const func = geolocationDslResolverMock.getPosition.calls.argsFor(0)[0];
            expect(func(position)).toBe(expectedPropertyValue);
        });
    }

    function runLocationTest(property: string, expectedPropertyValue: string | null) {
        it(`${property} should get from location`, () => {
            geolocationDslResolverMock.getLocation.and.returnValue('xxx');

            const result = getTarget()[property]; // act

            expect(result).toBe('xxx');
            const func = geolocationDslResolverMock.getLocation.calls.argsFor(0)[0];
            expect(func(position.mappedLocation)).toBe(expectedPropertyValue);
        });
    }

    it('watcher should invalidate cache if a new position', () => {
        getTarget();

        // act
        geolocationServiceMock.positionChanges.next(<GeolocationPosition>{});

        expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['geolocation']);
    });
});
