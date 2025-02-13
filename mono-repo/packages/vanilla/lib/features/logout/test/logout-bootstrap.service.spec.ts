import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    ON_LOGOUT_PROVIDER,
    RtmsType,
    ToastrSchedule,
    UserAutologout24HoursEvent,
    UserAutologoutEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserUpdateEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { Mock, MockContext, Stub } from 'moxxi';

import { AuthServiceMock, LogoutProvidersServiceMock } from '../../../core/test/auth/auth.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { CurrentSessionConfigMock } from '../../login-duration/test/current-session.mock';
import { LogoutBootstrapService } from '../src/logout-bootstrap.service';
import { LogoutMessageType } from '../src/logout.client-config';
import { LogoutConfigMock, LogoutResourceServiceMock } from './logout-config.mock';

@Mock({ of: ON_LOGOUT_PROVIDER })
class LogoutProviderMock {
    @Stub() onLogout: jasmine.Spy;
}

describe('LogoutBootstrapService', () => {
    let service: LogoutBootstrapService;
    let userMock: UserServiceMock;
    let authServiceMock: AuthServiceMock;
    let logoutConfigMock: LogoutConfigMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let rtmsServiceMock: RtmsServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let logoutResourceServiceMock: LogoutResourceServiceMock;
    let logoutProvidersServiceMock: LogoutProvidersServiceMock;
    let hookMock: LogoutProviderMock;
    let currentSessionConfigMock: CurrentSessionConfigMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        logoutConfigMock = MockContext.useMock(LogoutConfigMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);
        logoutResourceServiceMock = MockContext.useMock(LogoutResourceServiceMock);
        logoutProvidersServiceMock = MockContext.useMock(LogoutProvidersServiceMock);
        hookMock = MockContext.createMock(LogoutProviderMock);
        currentSessionConfigMock = MockContext.useMock(CurrentSessionConfigMock);

        TestBed.configureTestingModule({
            providers: [LogoutBootstrapService, MockContext.providers, { provide: ON_LOGOUT_PROVIDER, useValue: hookMock, multi: true }],
        });
        userMock.claims = <any>claimsServiceMock;

        service = TestBed.inject(LogoutBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should auto-logout after timeout if user has remaining login time', fakeAsync(() => {
            currentSessionConfigMock.remainingLoginTime = 5000;

            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();

            tick(5000);

            expect(authServiceMock.logout).toHaveBeenCalledOnceWith({ redirectAfterLogout: false, isAutoLogout: true });

            authServiceMock.logout.resolve();
            tick();

            expect(userMock.triggerEvent).toHaveBeenCalledOnceWith(jasmine.any(UserAutologoutEvent));
        }));

        it('should cancel auto-logout if remaining login time is changed to null', fakeAsync(() => {
            currentSessionConfigMock.remainingLoginTime = 5000;

            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            currentSessionConfigMock.remainingLoginTime = null;
            userMock.triggerEvent(new UserUpdateEvent(new Map<string, any>([['remainingLoginTime', null]])));

            tick(5000);

            expect(authServiceMock.logout).not.toHaveBeenCalledWith();
        }));

        it('should schedule auto-logout after remaining login time is set', fakeAsync(() => {
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            currentSessionConfigMock.remainingLoginTime = 7000;
            tick();

            userMock.triggerEvent(new UserUpdateEvent(new Map<string, any>([['remainingLoginTime', currentSessionConfigMock.remainingLoginTime]])));

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.AutoLogoutTimeout);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.AutoLogoutTimeout,
                { timeout: 7000 },
                jasmine.any(Function),
            );

            tick(currentSessionConfigMock.remainingLoginTime);

            expect(authServiceMock.logout).toHaveBeenCalledOnceWith({ redirectAfterLogout: false, isAutoLogout: true });
            authServiceMock.logout.resolve();
            tick();

            expect(userMock.triggerEvent).toHaveBeenCalledWith(jasmine.any(UserAutologoutEvent));
        }));

        it('should not auto-logout unauthenticated user (user in workflow state)', fakeAsync(() => {
            currentSessionConfigMock.remainingLoginTime = 5000;
            userMock.isAuthenticated = false;

            service.onFeatureInit();

            tick(5000);

            expect(authServiceMock.logout).not.toHaveBeenCalled();
        }));

        it('should instantly logout user if he logs in after login timer expired', fakeAsync(() => {
            currentSessionConfigMock.remainingLoginTime = 5000;
            userMock.isAuthenticated = false;

            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();

            tick(5000);

            userMock.triggerEvent(new UserLoginEvent());

            expect(authServiceMock.logout).toHaveBeenCalledOnceWith({ redirectAfterLogout: false, isAutoLogout: true });
            authServiceMock.logout.resolve();
            tick();

            expect(userMock.triggerEvent).toHaveBeenCalledWith(jasmine.any(UserAutologoutEvent));
        }));

        it('should logout if rtms auto logout event is received with correct payload', fakeAsync(() => {
            claimsServiceMock.get.withArgs('sessiontoken').and.returnValue('my_session_id');
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            rtmsServiceMock.messages.next({ eventId: 'test', type: RtmsType.AUTO_LOGOUT_EVENT, payload: { serviceSessionId: 'my_session_id' } });

            expect(authServiceMock.logout).toHaveBeenCalledOnceWith();
        }));
    });

    describe('on UserLogoutEvent', () => {
        it('should not add logout message toastr', fakeAsync(() => {
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();

            tick();

            expect(logoutProvidersServiceMock.registerProviders).toHaveBeenCalledOnceWith([hookMock]);

            userMock.triggerEvent(new UserLogoutEvent());

            expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
        }));

        it('should add toastr', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE_WITH_STATS;
            logoutResourceServiceMock.logoutPlaceholders = {
                foo: 'bar',
            };
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            expect(logoutProvidersServiceMock.registerProviders).toHaveBeenCalledOnceWith([hookMock]);

            userMock.triggerEvent(new UserLogoutEvent());

            expect(toastrQueueServiceMock.add).toHaveBeenCalledOnceWith(logoutConfigMock.logoutMessage, {
                schedule: ToastrSchedule.AfterNextNavigation,
                placeholders: logoutResourceServiceMock.logoutPlaceholders,
            });
        }));

        it('should not add toastr', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.DISABLED;
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            expect(logoutProvidersServiceMock.registerProviders).toHaveBeenCalledOnceWith([hookMock]);

            userMock.triggerEvent(new UserLogoutEvent());

            expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
        }));

        it('should navigate to logout with query string', fakeAsync(() => {
            service.onFeatureInit();
            logoutConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            expect(logoutProvidersServiceMock.registerProviders).toHaveBeenCalledOnceWith([hookMock]);

            userMock.triggerEvent(new UserAutologout24HoursEvent());

            expect(navigationServiceMock.goTo).toHaveBeenCalledOnceWith('/logout?logout24hours=true', {
                forceReload: true,
                appendReferrer: true,
            });
        }));
    });
});
