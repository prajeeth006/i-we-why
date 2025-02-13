import { TestBed } from '@angular/core/testing';

import { Position, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { GeolocationBrowserApiService, PositionError } from '../src/geolocation-browser-api.service';
import { GeolocationConfigMock } from './mocks';

describe('GeolocationBrowserApiService', () => {
    let target: GeolocationBrowserApiService;
    let windowMock: WindowMock;
    let configMock: GeolocationConfigMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        configMock = MockContext.useMock(GeolocationConfigMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                GeolocationBrowserApiService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
        target = TestBed.inject(GeolocationBrowserApiService);
    });

    it('should not watch position on construction', () => {
        expect(windowMock.navigator.geolocation.watchPosition).not.toHaveBeenCalled();
    });

    describe('positionChanges', () => {
        let changedSpy: jasmine.Spy;
        let errorSpy: jasmine.Spy;

        beforeEach(() => {
            changedSpy = jasmine.createSpy('changed');
            errorSpy = jasmine.createSpy('error');

            target.positionChanges.subscribe({ next: changedSpy, error: errorSpy });
        });

        it('should start watching position on get positionChanges', () => {
            expect(windowMock.navigator.geolocation.watchPosition).toHaveBeenCalledTimes(1);
            expect(getReceivedWatchOpts()).toBe(configMock.watchOptions);
            expect(changedSpy).not.toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
            verifyClearWatchCalledTimes(0);
        });

        it('should produce deeply cloned position on change', () => {
            const position: Position = {
                timestamp: 1590684765369,
                coords: {
                    latitude: 1,
                    longitude: 2,
                    altitude: 3,
                    accuracy: 4,
                    altitudeAccuracy: 5,
                    heading: 6,
                    speed: 7,
                },
            };

            callSuccessCallback(position); // act

            expect(changedSpy).toHaveBeenCalledTimes(1);
            const receivedPosition = changedSpy.calls.argsFor(0)[0];
            expect(receivedPosition).toEqual(position);
            expect(receivedPosition).not.withContext('should be copied from native object').toBe(position);
            expect(receivedPosition.coords).not.withContext('should be copied from native object').toBe(position.coords);
            expect(errorSpy).not.toHaveBeenCalled();
            verifyClearWatchCalledTimes(0);
        });

        it('should produce error if watch failed', () => {
            const error = getTestError(666);

            callErrorCallback(error); // act

            expect(errorSpy).toHaveBeenCalledWith(error);
            expect(errorSpy.calls.argsFor(0)[0]).not.withContext('should be copied from native object').toBe(error);
            expect(changedSpy).not.toHaveBeenCalled();
            verifyClearWatchCalledTimes(0);
        });

        it('should complete observable if denied error', () => {
            const error = getTestError(1);

            callErrorCallback(error); // act

            expect(errorSpy).toHaveBeenCalledWith(error);
            expect(changedSpy).not.toHaveBeenCalled();
            verifyClearWatchCalledTimes(1);
        });

        const getWatchCallArgs = () => windowMock.navigator.geolocation.watchPosition.calls.argsFor(0);
        const callSuccessCallback = (p: Position) => getWatchCallArgs()[0](p);
        const callErrorCallback = (e: PositionError) => getWatchCallArgs()[1](e);
        const getReceivedWatchOpts = () => getWatchCallArgs()[2];

        function verifyClearWatchCalledTimes(times: number) {
            expect(windowMock.navigator.geolocation.clearWatch).toHaveBeenCalledTimes(times);
        }

        function getTestError(code: number): PositionError {
            return {
                code,
                message: 'Oups',
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
            };
        }
    });
});
