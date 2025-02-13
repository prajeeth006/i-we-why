import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService, LogoutStage, NativeEventType, UserLoggingOutEvent, UserLogoutEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ClaimsConfig, UserConfig } from '../../src/core';
import { CookieServiceMock } from '../browser/cookie.mock';
import { ClientConfigServiceMock } from '../client-config/client-config.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';
import { LogoutProvidersServiceMock } from './auth.mock';

describe('AuthService', () => {
    let service: AuthService;
    let userMock: UserServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let logoutProvidersServiceMock: LogoutProvidersServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        logoutProvidersServiceMock = MockContext.useMock(LogoutProvidersServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AuthService],
        });

        service = TestBed.inject(AuthService);
    });

    describe('logout()', () => {
        it('should not logout if user is not logged in', () => {
            userMock.username = '';

            service.logout();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        });

        it('should logout user by making request to api', fakeAsync(() => {
            service.logout();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            expect(logoutProvidersServiceMock.invoke).toHaveBeenCalledWith(LogoutStage.BEFORE_LOGOUT);
            expect(apiServiceMock.post).toHaveBeenCalledWith('auth/logout');
            apiServiceMock.post.completeWith();
            tick();
            expect(logoutProvidersServiceMock.invoke).toHaveBeenCalledTimes(2);
            expect(logoutProvidersServiceMock.invoke).toHaveBeenCalledWith(LogoutStage.AFTER_LOGOUT);
        }));

        it('should broadcast events before and after logging out', fakeAsync(() => {
            service.logout();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            expect(userMock.triggerEvent).toHaveBeenCalledWith(jasmine.any(UserLoggingOutEvent));

            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            trackingServiceMock.triggerEvent.resolve();
            tick();

            expect(userMock.triggerEvent).toHaveBeenCalledWith(jasmine.any(UserLogoutEvent));
        }));

        it('should redirect to / after logout', fakeAsync(() => {
            service.logout();

            logoutProvidersServiceMock.invoke.resolve();
            tick();
            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            trackingServiceMock.triggerEvent.resolve();
            tick();

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/', { forceReload: true });
        }));

        it('should not redirect to / after logout if specified', fakeAsync(() => {
            service.logout({ redirectAfterLogout: false });
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            trackingServiceMock.triggerEvent.resolve();
            tick();

            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
            expect(clientConfigServiceMock.reload).toHaveBeenCalledWith([UserConfig, ClaimsConfig]);
        }));

        it('should not redirect after if specified native and rememberme logout prompt enabled.', fakeAsync(() => {
            nativeAppServiceMock.isNative = true;
            cookieServiceMock.get.withArgs('rm-lp').and.returnValue('1');

            service.logout({ redirectAfterLogout: true });
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            trackingServiceMock.triggerEvent.resolve();
            tick();

            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
            expect(clientConfigServiceMock.reload).toHaveBeenCalledWith([UserConfig, ClaimsConfig]);
        }));

        it('should track logout event', fakeAsync(() => {
            navigationServiceMock.location.path.and.returnValue('testurl');
            service.logout();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith(trackingServiceMock.event.userLogout, {
                'component.CategoryEvent': 'logout',
                'component.LabelEvent': 'success',
                'component.ActionEvent': 'attempt',
                'logout.type': 'standard logout',
                'component.LocationEvent': 'testurl',
            });
        }));

        it('should send LOGOUT event to native', fakeAsync(() => {
            service.logout();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            apiServiceMock.post.completeWith();
            tick();
            logoutProvidersServiceMock.invoke.resolve();
            tick();
            trackingServiceMock.triggerEvent.resolve();
            tick();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.LOGOUT,
                parameters: {
                    systemLogout: false,
                },
            });
        }));
    });

    describe('check()', () => {
        it('should make a request to api and return result', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.isAuthenticated().then(spy);

            expect(apiServiceMock.get).toHaveBeenCalledWith('auth/check');

            apiServiceMock.get.completeWith({ isAuthenticated: true });
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));
    });

    describe('duration()', () => {
        it('should make a request to api and return result', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.duration().then(spy);
            tick();

            expect(apiServiceMock.get).toHaveBeenCalledWith('auth/duration');

            apiServiceMock.get.completeWith({ duration: '01:02:03' });
            tick();

            expect(spy).toHaveBeenCalledWith('01:02:03');
        }));
    });

    describe('sessionTimeLeft()', () => {
        it('should make a request to api and return result', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.sessionTimeLeft().then(spy);
            tick();

            expect(apiServiceMock.get).toHaveBeenCalledWith('auth/sessiontimeleft');

            apiServiceMock.get.completeWith({ timeLeftInMiliseconds: 5 });
            tick();

            expect(spy).toHaveBeenCalledWith(5);
        }));
    });

    describe('ping()', () => {
        it('should make a request to api', fakeAsync(() => {
            service.ping();

            expect(apiServiceMock.get).toHaveBeenCalledWith('ping', null, { prefix: '' });
        }));
    });
});
