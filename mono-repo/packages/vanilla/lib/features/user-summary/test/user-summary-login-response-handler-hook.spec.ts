import { TestBed } from '@angular/core/testing';

import { LoginResponse, LoginResponseHandlerContext } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserSummaryCookieServiceMock } from '../../../shared/user-summary/test/user-summary.service.mock';
import { UserSummaryLoginResponseHandlerHook } from '../src/user-summary-login-response-handler-hook';
import { UserSummaryOverlayServiceMock } from './user-summary-overlay.service.mock';
import { UserSummaryConfigMock } from './user-summary.client-config.mock';

describe('UserSummaryLoginResponseHandlerHook', () => {
    let hook: UserSummaryLoginResponseHandlerHook;
    let userSummaryConfigMock: UserSummaryConfigMock;
    let userServiceMock: UserServiceMock;
    let userSummaryOverlayServiceMock: UserSummaryOverlayServiceMock;
    let userSummaryCookieServiceMock: UserSummaryCookieServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let response: LoginResponse;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        userSummaryConfigMock = MockContext.useMock(UserSummaryConfigMock);
        userSummaryOverlayServiceMock = MockContext.useMock(UserSummaryOverlayServiceMock);
        userSummaryCookieServiceMock = MockContext.useMock(UserSummaryCookieServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        response = { user: { isAuthenticated: true }, claims: {} };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserSummaryLoginResponseHandlerHook],
        });

        hook = TestBed.inject(UserSummaryLoginResponseHandlerHook);
        userSummaryConfigMock.skipOverlay = false;
    });

    describe('onPostLogin', () => {
        describe('willRedirectAfterLogin is true', () => {
            runTest('should save cookie when disabled', true, false, true, false);
            runTest('should save cookie when not real player', true, true, true, false);

            it('should show overlay when real player', () => {
                userServiceMock.realPlayer = true;

                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, true, true));

                expect(userSummaryCookieServiceMock.write).toHaveBeenCalled();

                navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

                expect(userSummaryOverlayServiceMock.init).toHaveBeenCalled();
            });
        });

        describe('willRedirectAfterLogin is false', () => {
            runTest('should save cookie when disabled', false, false, true, false);
            runTest('should save cookie when not real player', false, true, false, false);
            runTest('should show overlay when enabled and real player', false, true, false, true);
        });

        it('should not do anything if default redirectUrl is used', () => {
            response.redirectUrl = 'url';

            hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

            expect(userSummaryCookieServiceMock.write).not.toHaveBeenCalled();
            expect(userSummaryOverlayServiceMock.init).not.toHaveBeenCalled();
        });

        function runTest(testName: string, willRedirect: boolean, isRealPlayer: boolean, saveCookie: boolean, showOverlay: boolean) {
            it(testName, () => {
                userServiceMock.realPlayer = isRealPlayer;
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, willRedirect, true));

                if (saveCookie) expect(userSummaryCookieServiceMock.write).toHaveBeenCalled();
                if (showOverlay) expect(userSummaryOverlayServiceMock.init).toHaveBeenCalled();
            });
        }
    });
});
