import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    LOGIN_RESPONSE_HANDLER_HOOK,
    RtmsMessage,
    RtmsType,
    TimeSpan,
    UserAutologout24HoursEvent,
    UserAutologoutEvent,
} from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test';
import { LoginStoreServiceMock } from '../../../core/test/login/login-store.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { LoginResponseHandlerHookMock, LoginResponseHandlerServiceMock } from '../../login/test/login.mocks';
import { SessionLimitsBootstrapService } from '../src/session-limits-bootstrap.service';
import { SessionLimitNotification, SessionLimitType } from '../src/session-limits.models';
import { SessionLimitsConfigMock, SessionLimitsOverlayServiceMock, SessionLimitsTrackingServiceMock } from './session-limits.mocks';

describe('SessionLimitsBootstrapService', () => {
    let service: SessionLimitsBootstrapService;
    let sessionLimitsOverlayService: SessionLimitsOverlayServiceMock;
    let rtmsServiceMock: RtmsServiceMock;
    let userServiceMock: UserServiceMock;
    let sessionLimitsConfigMock: SessionLimitsConfigMock;
    let trackingServiceMock: SessionLimitsTrackingServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let hookMock: LoginResponseHandlerHookMock;

    beforeEach(() => {
        sessionLimitsOverlayService = MockContext.useMock(SessionLimitsOverlayServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        sessionLimitsConfigMock = MockContext.useMock(SessionLimitsConfigMock);
        trackingServiceMock = MockContext.useMock(SessionLimitsTrackingServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        hookMock = MockContext.createMock(LoginResponseHandlerHookMock);

        TestBed.configureTestingModule({
            providers: [
                SessionLimitsBootstrapService,
                MockContext.providers,
                { provide: LOGIN_RESPONSE_HANDLER_HOOK, useValue: hookMock, multi: true },
            ],
        });
        service = TestBed.inject(SessionLimitsBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should show overlay when authenticated and cookie entry is available', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            sessionLimitsConfigMock.version = 1;
            cookieServiceMock.get.and.returnValue('1');
            loginStoreServiceMock.PostLoginValues = {
                loginSessionLimitsElapsed: { accountName: 'sg_sgr019032' },
            };

            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            expect(loginResponseHandlerServiceMock.registerHooks).toHaveBeenCalledWith([hookMock]);
            expect(sessionLimitsOverlayService.show).toHaveBeenCalledWith({ accountName: 'sg_sgr019032' });
        }));

        it('should NOT show overlay when unauthenticated and cookie entry is available', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            sessionLimitsConfigMock.version = 1;
            cookieServiceMock.get.and.returnValue('1');
            loginStoreServiceMock.PostLoginValues = {
                loginSessionLimitsElapsed: {},
            };

            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalled();
        }));

        it('should NOT show overlay when authenticated and cookie entry is unavailable', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            loginStoreServiceMock.PostLoginValues = {
                loginSessionLimitsElapsed: {},
            };

            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalled();
        }));

        it('should NOT show overlay when post-login value is unavailable', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            cookieServiceMock.get.and.returnValue('1');

            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalled();
        }));

        it('should show overlay when SESSION_LIMIT_NOTIFICATION_EVENT RTMS message is received', fakeAsync(() => {
            service.onFeatureInit();
            sessionLimitsConfigMock.version = 1;
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.SESSION_LIMIT_NOTIFICATION_EVENT,
                eventId: '123',
                payload: {
                    accountName: 'br_sdsad0994',
                    frontend: 'br',
                    useCase: 'LOGIN_SESSION_LIMIT',
                    sessionLimits: [
                        {
                            sessionLimitType: SessionLimitType.MONTHLY_LIMIT,
                            percentageElapsed: 92,
                            sessionLimitElaspedMins: 48,
                            sessionLimitConfiguredMins: 60,
                        },
                    ],
                },
            };

            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).toHaveBeenCalledWith(rtmsTestMessage.payload);
        }));

        it('should trigger logout event when SESSION_LIMIT_NOTIFICATION_EVENT RTMS message is received with 100% elapsed', fakeAsync(() => {
            sessionLimitsConfigMock.isAutoLogoutEnabled = true;
            sessionLimitsConfigMock.version = 1;
            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.SESSION_LIMIT_NOTIFICATION_EVENT,
                eventId: '123',
                payload: {
                    accountName: 'br_sdsad0994',
                    frontend: 'br',
                    useCase: 'LOGIN_SESSION_LIMIT',
                    sessionLimits: [
                        {
                            sessionLimitType: SessionLimitType.MONTHLY_LIMIT,
                            percentageElapsed: 100,
                            sessionLimitElaspedMins: 48,
                            sessionLimitConfiguredMins: 60,
                        },
                    ],
                },
            };
            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalledWith(rtmsTestMessage.payload);
            expect(trackingServiceMock.trackSessionLimitsEvent).toHaveBeenCalledWith(
                rtmsTestMessage.payload.sessionLimits,
                'Load',
                'not applicable',
                'Logout Session Duration Limits Interceptor',
            );
            expect(userServiceMock.triggerEvent).toHaveBeenCalledWith(new UserAutologoutEvent());
        }));

        it('should NOT trigger logout event when SESSION_LIMIT_NOTIFICATION_EVENT RTMS message is received with 100% elapsed if disabled', fakeAsync(() => {
            service.onFeatureInit();
            sessionLimitsConfigMock.version = 1;
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.SESSION_LIMIT_NOTIFICATION_EVENT,
                eventId: '123',
                payload: {
                    accountName: 'br_sdsad0994',
                    frontend: 'br',
                    useCase: 'LOGIN_SESSION_LIMIT',
                    sessionLimits: [
                        {
                            sessionLimitType: SessionLimitType.MONTHLY_LIMIT,
                            percentageElapsed: 100,
                            sessionLimitElaspedMins: 48,
                            sessionLimitConfiguredMins: 60,
                        },
                    ],
                },
            };
            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalledWith(rtmsTestMessage.payload);
            expect(trackingServiceMock.trackSessionLimitsEvent).toHaveBeenCalledWith(
                rtmsTestMessage.payload.sessionLimits,
                'Load',
                'not applicable',
                'Logout Session Duration Limits Interceptor',
            );
            expect(userServiceMock.triggerEvent).not.toHaveBeenCalled();
        }));

        it('should show overlay when SESSION_LIMITS_PRE_LOGOUT_NOTIFICATION RTMS message is received', fakeAsync(() => {
            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                eventId: '123',
                type: RtmsType.SESSION_LIMITS_PRE_LOGOUT_NOTIFICATION,
                payload: {
                    accountName: 'br_validtnbwingr',
                    sessionLimits: [SessionLimitType.SESSION_TIMEOUT],
                    remainingTimeMillis: 136519,
                    configuredTimeMillis: 120000,
                },
            };
            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).toHaveBeenCalledWith({
                accountName: 'br_validtnbwingr',
                sessionLimits: [
                    {
                        percentageElapsed: 100,
                        sessionLimitType: SessionLimitType.SESSION_TIMEOUT,
                        sessionLimitConfiguredMins: 2,
                        sessionLimitElaspedMins: 0,
                    },
                ],
            });
        }));

        it('should show overlay when GREECE_TAX_SESSION_LOGOUT RTMS message is received', fakeAsync(() => {
            userServiceMock.globalSession = '305707310822020MnJBBgqbVs4';
            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.GREECE_TAX_SESSION_LOGOUT,
                eventId: '123',
                payload: {
                    accountName: 'br_sdsad0994',
                    logoutType: SessionLimitType.SESSION_EXPIRED,
                    elapsedPercentage: 80,
                    globalSessionId: '305707310822020MnJBBgqbVs4',
                },
            };

            const configMins = TimeSpan.fromHours(24).totalMinutes;
            const elapsedMins = Math.round(configMins * (80 / 100));

            const notification: SessionLimitNotification = {
                accountName: 'br_sdsad0994',
                isSessionExpired: true,
                sessionLimits: [
                    {
                        percentageElapsed: 80,
                        sessionLimitType: SessionLimitType.SESSION_EXPIRED,
                        sessionLimitConfiguredMins: configMins,
                        sessionLimitElaspedMins: elapsedMins,
                    },
                ],
            };

            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).toHaveBeenCalledWith(notification);
        }));

        it('should not do anything if globalsessionid is different', fakeAsync(() => {
            userServiceMock.globalSession = '55555555555555nJASwere44';
            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.GREECE_TAX_SESSION_LOGOUT,
                eventId: '123',
                payload: {
                    accountName: 'br_sdsad0994',
                    logoutType: SessionLimitType.SESSION_EXPIRED,
                    elapsedPercentage: 80,
                    globalSessionId: '305707310822020MnJBBgqbVs4',
                },
            };

            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(userServiceMock.triggerEvent).not.toHaveBeenCalled();
            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalled();
        }));

        it('should trigger logout24HoursEvent when GREECE_TAX_SESSION_LOGOUT RTMS message is received with 100% elapsed', fakeAsync(() => {
            service.onFeatureInit();
            sessionLimitsConfigMock.whenReady.next();
            tick();

            const rtmsTestMessage: RtmsMessage = {
                type: RtmsType.GREECE_TAX_SESSION_LOGOUT,
                eventId: '123',
                payload: {
                    logoutType: SessionLimitType.SESSION_EXPIRED,
                    elapsedPercentage: 100,
                },
            };

            rtmsServiceMock.messages.next(rtmsTestMessage);

            expect(sessionLimitsOverlayService.show).not.toHaveBeenCalledWith(rtmsTestMessage.payload);
            expect(trackingServiceMock.trackSingleSessionLimitEvent).toHaveBeenCalledWith(
                'Load',
                'Logout',
                'Log out Single Session Duration Limits Interceptor',
            );
            expect(userServiceMock.triggerEvent).toHaveBeenCalledWith(new UserAutologout24HoursEvent());
        }));
    });
});
