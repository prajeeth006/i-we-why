import { TestBed } from '@angular/core/testing';

import { CookieName, GeolocationPosition } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { GeolocationCookieService } from '../src/geolocation-cookie.service';
import { GeolocationConfigMock } from './mocks';

describe('GeolocationCookieService', () => {
    let target: GeolocationCookieService;
    let configMock: GeolocationConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;

    beforeEach(() => {
        configMock = MockContext.useMock(GeolocationConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationCookieService],
        });
        target = TestBed.inject(GeolocationCookieService);
    });

    describe('read()', () => {
        it('should parse position from cookie', () => {
            cookieServiceMock.get.withArgs(CookieName.GeoLocation).and.returnValue(`{
                "timestamp": 1590684765369,
                "coords": { "latitude": 1, "longitude": 2 },
                "mappedLocation": { "locationId": "xxx", "locationName": "Laufhaus Wien Mitte" }
            }`);

            const position = target.read(); // act

            expect(position).toEqual(<GeolocationPosition>{
                timestamp: 1590684765369,
                coords: { latitude: 1, longitude: 2 },
                mappedLocation: { locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' },
            });
        });

        runNullTest('undefined', undefined);
        runNullTest('null', null);
        runNullTest('empty', '');
        runNullTest('white-space', '  ');

        function runNullTest(testName: string, value: string | null | undefined) {
            it(`should return null if ${testName} cookie`, () => {
                cookieServiceMock.get.withArgs(CookieName.GeoLocation).and.returnValue(value);
                expect(target.read()).toBeNull(); // act
            });
        }
    });

    describe('write()', () => {
        const now = 1590684765369;
        runTest('session', 0, undefined);
        runTest('permanent', 16000, new Date(now + 16000));

        function runTest(cookieDesc: string, configuredExpiration: number, expectedExpires: Date | undefined) {
            it(`should write ${cookieDesc} cookie`, () => {
                const position = <GeolocationPosition>{ coords: { latitude: 1, longitude: 2 } };
                const expires = expectedExpires ? { expires: expectedExpires } : undefined;

                configMock.cookieExpirationMilliseconds = configuredExpiration;
                dateTimeServiceMock.now.and.returnValue(new Date(now));

                target.write(position); // act

                expect(cookieServiceMock.putObject).toHaveBeenCalledWith(CookieName.GeoLocation, position, expires);
            });
        }
    });

    it('delete() should delete the cookie', () => {
        target.delete(); // act
        expect(cookieServiceMock.remove).toHaveBeenCalledWith(CookieName.GeoLocation);
    });
});
