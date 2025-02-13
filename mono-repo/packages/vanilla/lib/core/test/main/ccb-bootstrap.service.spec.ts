import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEvent, UrlService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceFingerprintServiceMock } from '../../../features/login/test/device-fingerprint.mock';
import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { CcbBootstrapService } from '../../src/main/ccb-bootstrap.service';
import { TrackingServiceMock } from '../../src/tracking/test/tracking.mock';
import { AuthServiceMock } from '../auth/auth.mock';
import { CookieServiceMock } from '../browser/cookie.mock';
import { LoggerMock } from '../languages/logger.mock';
import { LoginService2Mock } from '../login/login-service.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';
import { UserServiceMock } from '../user/user.mock';

describe('CcbBootstrapService', () => {
    let service: CcbBootstrapService;
    let nativeAppServiceMock: NativeAppServiceMock;
    let userMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let authServiceMock: AuthServiceMock;
    let windowMock: WindowMock;
    let trackingServiceMock: TrackingServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let urlService: UrlService;
    let deviceFingerprintServiceMock: DeviceFingerprintServiceMock;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        windowMock = new WindowMock();
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        deviceFingerprintServiceMock = MockContext.useMock(DeviceFingerprintServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(LoginService2Mock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                UrlService,
                CcbBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
        windowMock.location.href = 'http://test.com';
        urlService = TestBed.inject(UrlService);
        service = TestBed.inject(CcbBootstrapService);

        nativeAppServiceMock.isNative = true;

        service.onAppInit();
    });

    it('should send ccb initialized event', () => {
        nativeAppServiceMock.isNative = true;

        service.onAppInit();

        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'CCB_INITIALIZED' });
    });

    it('should receive events from native app 1', () => {
        nativeAppServiceMock.isNative = true;

        service.onAppInit();

        const event: NativeEvent = { eventName: 'test' };

        (window as any)['vanillaApp'].native.messageToWeb(event);

        expect(nativeAppServiceMock.onReceivedEventFromNative).toHaveBeenCalledWith(event);
    });

    it('should receive events from native app 2', () => {
        nativeAppServiceMock.isNative = true;

        service.onAppInit();

        const event: NativeEvent = { eventName: 'test' };

        windowMock['messageToWeb'](event);

        expect(nativeAppServiceMock.onReceivedEventFromNative).toHaveBeenCalledWith(event);
    });

    it('should receive events from native app 3', () => {
        nativeAppServiceMock.isNative = true;

        service.onAppInit();

        const parameters = { a: 1 };

        windowMock['NativeCallEntryProc']('test', '{ "a": 1 }');

        expect(nativeAppServiceMock.onReceivedEventFromNative).toHaveBeenCalledWith({ eventName: 'test', parameters });
    });

    describe('LOGOUT', () => {
        it('should call logout if LOGOUT event received from native', () => {
            userMock.isAuthenticated = true;
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'LOGOUT', parameters: {} });

            expect(authServiceMock.logout).toHaveBeenCalled();
        });

        it('should call logout if LOGOUT event received from native and in workflow', () => {
            userMock.isAuthenticated = false;
            userMock.workflowType = 10;
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'LOGOUT', parameters: {} });

            expect(authServiceMock.logout).toHaveBeenCalled();
        });
    });

    describe('IS_LOGGED_IN and APP_FOREGRND', () => {
        it('should respond with users authenticated state from api', fakeAsync(() => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'IS_LOGGED_IN', parameters: {} });
            authServiceMock.isAuthenticated.resolve(true);
            tick();

            expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'IS_LOGGED_IN', parameters: { isLoggedIn: true } });

            nativeAppServiceMock.eventsFromNative.next({ eventName: 'APP_FOREGRND', parameters: {} });
            authServiceMock.isAuthenticated.resolve(true);
            tick();

            expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'APP_FOREGRND', parameters: { isLoggedIn: true } });
        }));

        it('should request geolocation on APP_FOREGRND', fakeAsync(() => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'APP_FOREGRND', parameters: {} });
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'GET_GEO_LOCATION_POSITION' });
        }));
    });

    describe('NAVIGATE_TO', () => {
        it('should navigate to specified url when language is not specified', () => {
            const parsedUrl = urlService.parse('http://m.bwin.dev/en/mobileportal/register');

            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://m.bwin.dev/en/mobileportal/register' },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });
        });

        it('should change specified url culture and navigate if the language is specified and supported', () => {
            const parsedUrl = urlService.parse('http://m.bwin.dev/de/mobileportal/register');

            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://m.bwin.dev/en/mobileportal/register', language: 'de' },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });
        });

        it('should navigate to specified url if the language is specified but not supported', () => {
            const parsedUrl = urlService.parse('http://m.bwin.dev/en/mobileportal/register');

            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://m.bwin.dev/en/mobileportal/register', language: 'bg' },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });
        });

        it('should navigate to specified url if the language is specified but top domain is not same', () => {
            const parsedUrl = urlService.parse('http://google.com');

            nativeAppServiceMock.eventsFromNative.next({ eventName: 'NAVIGATE_TO', parameters: { URL: 'http://google.com', language: 'bg' } });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });
        });

        it('should navigate with full page reload', () => {
            const parsedUrl = urlService.parse('http://google.com');
            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://google.com', language: 'bg', forceReload: true },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: true });

            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://google.com', language: 'bg', forceReload: 'true' },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: true });
        });

        it('should navigate without full page reload', () => {
            const parsedUrl = urlService.parse('http://google.com');
            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://google.com', language: 'bg', forceReload: false },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });

            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'NAVIGATE_TO',
                parameters: { URL: 'http://google.com', language: 'bg', forceReload: 'false' },
            });

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrl, { forceReload: false });
        });

        it('should not navigate if url is not specified', () => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'NAVIGATE_TO' });

            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        });
    });

    describe('TRACK_DEVICE_IDFA', () => {
        it('should call updateDataLayer and save deviceId in cookie if device_idfa is specified', () => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'TRACK_DEVICE_IDFA', parameters: { device_idfa: '5574-698' } });

            expect(trackingServiceMock.updateDataLayer).toHaveBeenCalledWith({ 'user.profile.dvID': '5574-698' });
            expect(cookieServiceMock.put).toHaveBeenCalledWith('deviceId', '5574-698');
        });

        it('should not call updateDataLayer and save deviceId in cookie if device_idfa is not specified', () => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'TRACK_DEVICE_IDFA', parameters: {} });

            expect(trackingServiceMock.updateDataLayer).not.toHaveBeenCalled();
            expect(cookieServiceMock.put).not.toHaveBeenCalled();
        });
    });

    describe('REMOVE_COOKIE', () => {
        it('should remove cookie', () => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'REMOVE_COOKIE', parameters: { name: 'c1' } });

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('c1');
        });
    });

    describe('Fingerprint', () => {
        it('should add deviceDetails cookie', () => {
            nativeAppServiceMock.eventsFromNative.next({
                eventName: 'fingerprint',
                parameters: {
                    deviceDetails: {
                        os: 'iOS',
                        dm: 'iPhone11',
                        slno: '4A3D263C-A1B6-4671-9589-5D5C10581E09',
                        osv: '13.5',
                    },
                },
            });

            expect(deviceFingerprintServiceMock.storeDeviceDetails).toHaveBeenCalledWith({
                os: 'iOS',
                dm: 'iPhone11',
                slno: '4A3D263C-A1B6-4671-9589-5D5C10581E09',
                osv: '13.5',
            });
        });
    });
});
