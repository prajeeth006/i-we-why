import { TestBed } from '@angular/core/testing';

import { CookieName, LoginResponse, LoginResponseHandlerContext } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { SessionLimitsLoginResponseHandlerHook } from '../src/session-limits-login-response-handler-hook';
import { SessionLimitNotification, SessionLimitType } from '../src/session-limits.models';
import { SessionLimitsConfigMock, SessionLimitsOverlayServiceMock } from './session-limits.mocks';

describe('SessionLimitsLoginResponseHandlerHook', () => {
    let hook: SessionLimitsLoginResponseHandlerHook;
    let sessionLimitsConfigMock: SessionLimitsConfigMock;
    let sessionLimitsOverlayServiceMock: SessionLimitsOverlayServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let response: LoginResponse;
    let loginSessionLimitsElapsed: SessionLimitNotification;

    beforeEach(() => {
        sessionLimitsConfigMock = MockContext.useMock(SessionLimitsConfigMock);
        sessionLimitsOverlayServiceMock = MockContext.useMock(SessionLimitsOverlayServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        loginSessionLimitsElapsed = {
            accountName: 'sg_sgr019032',
            frontend: 'sg',
            useCase: 'LOGIN_SESSION_LIMIT',
            sessionLimits: [
                {
                    sessionLimitType: SessionLimitType.MONTHLY_LIMIT,
                    percentageElapsed: 81,
                    sessionLimitElaspedMins: 48,
                    sessionLimitConfiguredMins: 60,
                },
            ],
        };

        response = {
            postLoginValues: {
                loginSessionLimitsElapsed: JSON.stringify(loginSessionLimitsElapsed),
            },
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionLimitsLoginResponseHandlerHook],
        });

        hook = TestBed.inject(SessionLimitsLoginResponseHandlerHook);
    });

    describe('onPostLogin', () => {
        describe('willRedirectAfterLogin is true', () => {
            it('should save cookie when disabled', () => {
                sessionLimitsConfigMock.skipOverlay = true;
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, true, true));

                expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.SessionLimits, '1');
                expect(sessionLimitsOverlayServiceMock.show).not.toHaveBeenCalled();
            });

            it('should show overlay on location change when enabled', () => {
                sessionLimitsConfigMock.skipOverlay = false;
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, true, true));

                expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.SessionLimits, '1');

                navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
                const handleSessionSpy = spyOn(hook, 'handlePostLoginOverlay');
                hook.handlePostLoginOverlay(loginSessionLimitsElapsed);

                expect(handleSessionSpy).toHaveBeenCalledWith(loginSessionLimitsElapsed);
            });
        });

        describe('willRedirectAfterLogin is false', () => {
            it('should save cookie when disabled', () => {
                sessionLimitsConfigMock.skipOverlay = true;
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

                expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.SessionLimits, '1');
                expect(sessionLimitsOverlayServiceMock.show).not.toHaveBeenCalled();
            });

            it('should show overlay when enabled', () => {
                sessionLimitsConfigMock.skipOverlay = false;
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));
                const handleSessionSpy = spyOn(hook, 'handlePostLoginOverlay');
                hook.handlePostLoginOverlay(loginSessionLimitsElapsed);

                expect(cookieServiceMock.put).not.toHaveBeenCalled();
                expect(handleSessionSpy).toHaveBeenCalledWith(loginSessionLimitsElapsed);
            });
        });

        it('should not do anything if default redirectUrl is used', () => {
            response.redirectUrl = 'url';

            hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

            expect(cookieServiceMock.put).not.toHaveBeenCalled();
            expect(sessionLimitsOverlayServiceMock.show).not.toHaveBeenCalled();
        });
    });
});
