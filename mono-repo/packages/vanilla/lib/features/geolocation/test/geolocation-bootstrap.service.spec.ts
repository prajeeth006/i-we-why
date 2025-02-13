import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { Coordinates, MappedGeolocation } from '../../../core/src/lazy/service-providers/geolocationposition';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { UserLoginEvent } from '../../../core/src/user/user-events';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { GeolocationBootstrapService } from '../src/geolocation-bootstrap.service';
import { GeolocationConfigMock, GeolocationServiceMock } from './mocks';

describe('GeolocationBootstrapService', () => {
    let target: GeolocationBootstrapService;
    let configMock: GeolocationConfigMock;
    let geolocationServiceMock: GeolocationServiceMock;
    let userServiceMock: UserServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        configMock = MockContext.useMock(GeolocationConfigMock);
        MockContext.useMock(NativeAppServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        geolocationServiceMock = MockContext.useMock(GeolocationServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationBootstrapService],
        });
        target = TestBed.inject(GeolocationBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should clear everything if disabled', fakeAsync(() => {
            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            expect(geolocationServiceMock.clearPositionForGood).toHaveBeenCalled();
        }));

        it('should restore last position from cookie', fakeAsync(() => {
            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            expect(geolocationServiceMock.watchBrowserPositionChanges).not.toHaveBeenCalled();
            expect(geolocationServiceMock.restoreLastPositionFromCookie).toHaveBeenCalled();
            expect(geolocationServiceMock.watchNativePositionChanges).toHaveBeenCalled();
        }));

        it('should watch for browser positon if enabled on app start', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            expect(geolocationServiceMock.watchBrowserPositionChanges).toHaveBeenCalled();
            expect(geolocationServiceMock.restoreLastPositionFromCookie).toHaveBeenCalled();
            expect(geolocationServiceMock.watchNativePositionChanges).toHaveBeenCalled();
        }));

        it('should send geolocation to datalayer after login event and location changes, only once', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First events
            userServiceMock.triggerEvent(new UserLoginEvent());
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            //Second events
            userServiceMock.triggerEvent(new UserLoginEvent());
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(1);
        }));

        it('should send geolocation to datalayer after page load if already logged in and location changes, only once', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;
            userServiceMock.isAuthenticated = true;

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First events
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            //Second events
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(1);
        }));

        it('should not send geolocation to datalayer if cookie exists', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;
            userServiceMock.isAuthenticated = true;
            cookieServiceMock.get.and.returnValue('1');

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First events
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        }));

        it('should unsubscribe from position changes if cookie exits', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;
            userServiceMock.isAuthenticated = true;
            cookieServiceMock.get.and.returnValue('1');

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First event
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            //Second event
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            expect(cookieServiceMock.get).toHaveBeenCalledTimes(1);
        }));

        it('should not send multiple times when authenticates after multiple position changes', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First event
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            //Second event
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            //Second event
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            userServiceMock.triggerEvent(new UserLoginEvent());
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(1);
        }));

        it('should not send event when user is authenticated but has postlogin workflow', fakeAsync(() => {
            configMock.watchBrowserPositionOnAppStart = true;
            userServiceMock.isAuthenticated = true;
            userServiceMock.workflowType = -3;

            target.onFeatureInit(); // act
            configMock.whenReady.next();
            tick();

            //First events
            geolocationServiceMock.positionChanges.next({
                timestamp: 123123123,
                coords: {} as Coordinates,
                mappedLocation: {} as MappedGeolocation,
            });
            tick();

            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        }));
    });
});
