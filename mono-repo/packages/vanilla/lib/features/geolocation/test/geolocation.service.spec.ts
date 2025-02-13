import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Coordinates, GeolocationPosition, MappedGeolocation, Position } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { GeolocationService } from '../src/geolocation.service';
import { GeolocationBrowserApiServiceMock, GeolocationConfigMock, GeolocationCookieServiceMock, GeolocationResourceServiceMock } from './mocks';

describe('GeolocationService', () => {
    let target: GeolocationService;
    let browserApiMock: GeolocationBrowserApiServiceMock;
    let logMock: LoggerMock;
    let configMock: GeolocationConfigMock;
    let cookieMock: GeolocationCookieServiceMock;
    let resourceMock: GeolocationResourceServiceMock;
    let timerMock: TimerServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    let changedSpy: jasmine.Spy;
    let errorSpy: jasmine.Spy;

    beforeEach(() => {
        browserApiMock = MockContext.useMock(GeolocationBrowserApiServiceMock);
        logMock = MockContext.useMock(LoggerMock);
        configMock = MockContext.useMock(GeolocationConfigMock);
        cookieMock = MockContext.useMock(GeolocationCookieServiceMock);
        resourceMock = MockContext.useMock(GeolocationResourceServiceMock);
        timerMock = MockContext.useMock(TimerServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationService],
        });
        target = TestBed.inject(GeolocationService);

        changedSpy = jasmine.createSpy('changed');
        errorSpy = jasmine.createSpy('error');
        target.positionChanges.subscribe({ next: changedSpy, error: errorSpy });
    });

    describe('should clear everything if disabled', () => {
        it('in browser', () => {
            const error = { code: 1, msg: 'Oups', PERMISSION_DENIED: 1 };
            target.watchBrowserPositionChanges();

            browserApiMock.positionChanges.error(error); // act

            expect(logMock.debug).toHaveBeenCalledWith('VanillaGeolocation is disabled by user in the browser.');
            expect(errorSpy).toHaveBeenCalledWith(error);
            expect(target.currentPosition).toBeNull();
            expect(changedSpy).not.toHaveBeenCalled();
            expect(cookieMock.delete).toHaveBeenCalled();
        });
    });

    describe('restoreLastPositionFromCookie', () => {
        it('should restore last position from cookie if valid one', () => {
            const position = <GeolocationPosition>{
                timestamp: 1590684765369,
                coords: { latitude: 1, longitude: 2 },
                mappedLocation: { locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' },
            };
            cookieMock.read.and.returnValue(position);

            target.restoreLastPositionFromCookie(); // act

            expect(target.currentPosition).toBe(position);
            expect(changedSpy).toHaveBeenCalledWith(position);
            expect(logMock.debug).toHaveBeenCalledWith('VanillaGeolocation restored this position from the cookie:', target.currentPosition);
        });

        it('should NOT restore last position from cookie if null', () => {
            cookieMock.read.and.returnValue(null);

            target.restoreLastPositionFromCookie(); // act

            expect(target.currentPosition).toBeNull();
            expect(changedSpy).not.toHaveBeenCalled();
            expect(logMock.debug).not.toHaveBeenCalled();
        });

        afterEach(() => {
            expect(cookieMock.delete).not.toHaveBeenCalled();
        });
    });

    describe('browser api geolocation', () => {
        let subscribeSpy: jasmine.Spy;
        beforeEach(() => {
            subscribeSpy = spyOn(browserApiMock.positionChanges, 'subscribe');
        });

        it('should subscribe to browser api changes', () => {
            target.watchBrowserPositionChanges();

            expect(subscribeSpy).toHaveBeenCalled();
        });

        it('should not subscribe to browser api changes', () => {
            configMock.useBrowserGeolocation = false;
            target.watchBrowserPositionChanges();

            expect(subscribeSpy).not.toHaveBeenCalled();
        });
    });

    describe('on position event from browser', () => {
        afterEach(() => {
            expect(cookieMock.delete).not.toHaveBeenCalled();
        });

        it('should map new coordinates to location from backend', fakeAsync(() => {
            const location = <MappedGeolocation>{ locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' };

            runMappingTest((o) => o.completeWith(location), location);

            expect(logMock.debug).toHaveBeenCalledWith(
                `VanillaGeolocation mapped new coordinates to following location. Writing it all to 'geolocation' cookie.`,
                location,
            );
        }));

        it('should use null if failed mapping coordinates to location on backend', fakeAsync(() => {
            const error = { message: 'Oups' };

            runMappingTest((o) => o.error(error), null);

            expect(logMock.errorRemote).toHaveBeenCalledWith(
                `VanillaGeolocation failed mapping new coordinates. Using them with null mapped location. Writing it all to 'geolocation' cookie. Error:`,
                error,
            );
        }));

        it('should not map new position but only update timestamp if coords equal to previous position coords', () => {
            const previousPosition = initWithPreviousPosition();
            const newPosition = mockApiPosition(undefined, previousPosition.coords);

            // act
            browserApiMock.positionChanges.next(newPosition);

            const expected = <GeolocationPosition>{
                timestamp: newPosition.timestamp,
                coords: previousPosition.coords,
                mappedLocation: previousPosition.mappedLocation,
            };
            expect(target.currentPosition).toEqual(expected);
            expect(changedSpy).not.toHaveBeenCalled(); // should be silent update with no observable publish
            expect(cookieMock.write).toHaveBeenCalledWith(expected);
            expectNoMappingScheduled();
            expect(logMock.debug).toHaveBeenCalledWith(
                `VanillaGeolocation received same coordinates as the last position has. Only updating timestamp to ${newPosition.timestamp}. Writing it all to 'geolocation' cookie. Last position:`,
                previousPosition,
            );
        });

        it('should correctly schedule mapping to location from backend', fakeAsync(() => {
            configMock.minimumUpdateIntervalMilliseconds = 600;
            const previous = initWithPreviousPosition();
            timerMock.setTimeout.and.returnValue('t1');

            // act 1
            browserApiMock.positionChanges.next(mockApiPosition(previous.timestamp + 200));

            expect(timerMock.setTimeout).toHaveBeenCalledTimes(1);
            expect(timerMock.setTimeout.calls.argsFor(0)[1]).toBe(400);

            // act 2
            browserApiMock.positionChanges.next(mockApiPosition(previous.timestamp + 700));

            expect(timerMock.clearTimeout).toHaveBeenCalledWith('t1');
            expect(timerMock.setTimeout).toHaveBeenCalledTimes(2);
            expect(timerMock.setTimeout.calls.argsFor(1)[1]).toBe(0);
        }));

        it('should log warning if position error', () => {
            const previousPosition = initWithPreviousPosition();
            const error = { msg: 'Oups', PERMISSION_DENIED: 1 };

            // act
            browserApiMock.positionChanges.error(error);

            expect(target.currentPosition).toBe(previousPosition);
            expect(changedSpy).not.toHaveBeenCalled();
            expect(cookieMock.write).not.toHaveBeenCalled();
            expectNoMappingScheduled();
            expect(logMock.warn).toHaveBeenCalledWith(
                'VanillaGeolocation failed to watch the position. Using the last one and watch continues. Error:',
                error,
            );
        });

        function expectNoMappingScheduled() {
            expect(timerMock.setTimeout).not.toHaveBeenCalled();
            expect(resourceMock.mapGeolocation).not.toHaveBeenCalledWith();
        }
    });

    describe('on position event from native app', () => {
        beforeEach(() => {
            nativeAppServiceMock.isNative = true;
        });

        afterEach(() => {
            expect(cookieMock.delete).not.toHaveBeenCalled();
        });

        it('should map new coordinates to location from backend', fakeAsync(() => {
            const location = <MappedGeolocation>{ locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' };

            runMappingTest((o) => o.completeWith(location), location, false);

            expect(logMock.debug).toHaveBeenCalledWith(
                `VanillaGeolocation mapped new coordinates to following location. Writing it all to 'geolocation' cookie.`,
                location,
            );
        }));

        it('should use null if failed mapping coordinates to location on backend', fakeAsync(() => {
            const error = { message: 'Oups' };

            runMappingTest((o) => o.error(error), null, false);

            expect(logMock.errorRemote).toHaveBeenCalledWith(
                `VanillaGeolocation failed mapping new coordinates. Using them with null mapped location. Writing it all to 'geolocation' cookie. Error:`,
                error,
            );
        }));

        it('should not map new position but only update timestamp if coords equal to previous position coords', () => {
            const previousPosition = initWithPreviousPosition();
            const timestamp = 1500000000001;

            // act
            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'GEO_LOCATION_POSITION',
                parameters: {
                    ...previousPosition.coords,
                    time: timestamp / 1000,
                },
            });

            const expected = <GeolocationPosition>{
                timestamp: timestamp,
                coords: previousPosition.coords,
                mappedLocation: previousPosition.mappedLocation,
            };
            expect(target.currentPosition).toEqual(expected);
            expect(changedSpy).not.toHaveBeenCalled(); // should be silent update with no observable publish
            expect(cookieMock.write).toHaveBeenCalledWith(expected);
            expect(logMock.debug).toHaveBeenCalledWith(
                `VanillaGeolocation received same coordinates as the last position has. Only updating timestamp to ${timestamp}. Writing it all to 'geolocation' cookie. Last position:`,
                previousPosition,
            );
        });
    });

    function runMappingTest(respondToMapping: (s: jasmine.ObservableSpy) => void, expectedLocation: MappedGeolocation | null, useBrowserApi = true) {
        const position = mockApiPosition();
        target.watchNativePositionChanges();
        target.restoreLastPositionFromCookie();
        target.watchBrowserPositionChanges();

        // act
        if (useBrowserApi) browserApiMock.positionChanges.next(position);
        else
            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'GEO_LOCATION_POSITION',
                parameters: {
                    ...position.coords,
                    time: position.timestamp / 1000,
                },
            });

        tick();
        respondToMapping(resourceMock.mapGeolocation);

        const expected = <GeolocationPosition>{
            timestamp: position.timestamp,
            coords: position.coords,
            mappedLocation: expectedLocation,
        };
        expect(target.currentPosition).toEqual(expected);
        expect(changedSpy).toHaveBeenCalledWith(expected);
        expect(cookieMock.write).toHaveBeenCalledWith(expected);
        expect(resourceMock.mapGeolocation).toHaveBeenCalledWith(position.coords);
        if (useBrowserApi) {
            expect(timerMock.setTimeout).toHaveBeenCalled();
            expect(logMock.debug).toHaveBeenCalledWith(
                `VanillaGeolocation received new coordinates at time ${position.timestamp}. Mapping them to a location on backend in 0 milliseconds. New coordinates:`,
                position.coords,
            );
        }
    }

    function initWithPreviousPosition(): GeolocationPosition {
        const position = <GeolocationPosition>{
            timestamp: 1500000000000,
            coords: { latitude: 1, longitude: 1, accuracy: 4, altitude: 7, altitudeAccuracy: 9, heading: 9, speed: 13 },
            mappedLocation: { locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' },
        };
        cookieMock.read.and.returnValue(position);
        target.watchNativePositionChanges();
        target.restoreLastPositionFromCookie();
        target.watchBrowserPositionChanges();
        changedSpy.calls.reset();
        return position;
    }

    function mockApiPosition(
        timestamp = 1500000099999,
        coords = <Coordinates>{ latitude: 1, longitude: 1, speed: 5, altitude: 6, accuracy: 7, altitudeAccuracy: 8, heading: 9 },
    ) {
        return <Position>{ timestamp, coords };
    }
});
