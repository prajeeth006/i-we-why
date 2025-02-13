import { TestBed } from '@angular/core/testing';

import { UserLoginEvent, UserLogoutEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { RememberMeServiceMock } from '../../../core/test/login/remember-me/remember-me.service.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { RememberMeLogoutPromptBootstrapService } from '../src/remember-me-logout-prompt-bootstrap.service';
import { RememberMeLogoutPromptConfigMock } from './remember-me-logout-prompt.mocks';

describe('RememberMeLogoutPromptBootstrapService', () => {
    let service: RememberMeLogoutPromptBootstrapService;
    let user: UserServiceMock;
    let navigation: NavigationServiceMock;
    let rememberMeService: RememberMeServiceMock;
    let cookieService: CookieServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let rememberMeLogoutConfig: RememberMeLogoutPromptConfigMock;

    beforeEach(() => {
        user = MockContext.useMock(UserServiceMock);
        navigation = MockContext.useMock(NavigationServiceMock);
        rememberMeService = MockContext.useMock(RememberMeServiceMock);
        cookieService = MockContext.useMock(CookieServiceMock);
        rememberMeLogoutConfig = MockContext.useMock(RememberMeLogoutPromptConfigMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        user.claims = <any>claimsServiceMock;

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RememberMeLogoutPromptBootstrapService],
        });

        service = TestBed.inject(RememberMeLogoutPromptBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should set rm-lp cookie and resolve greeting from claims', () => {
            claimsServiceMock.get.and.returnValue('USERNAME');
            service.onFeatureInit();
            rememberMeLogoutConfig.whenReady.next();

            expect(cookieService.put).toHaveBeenCalledWith('rm-lp', '1');
            expect(user.claims.get).toHaveBeenCalledWith(rememberMeLogoutConfig.content.messages!['claimGreetingProperty']!);
            expect(rememberMeLogoutConfig.content.text).toBe('Hi USERNAME');
        });

        it('should set rm-lp cookie and resolve greeting from claims on login', () => {
            claimsServiceMock.get.and.returnValue('USERNAME');
            service.onFeatureInit();
            rememberMeLogoutConfig.whenReady.next();

            user.triggerEvent(new UserLoginEvent());
            expect(user.claims.get).toHaveBeenCalledWith(rememberMeLogoutConfig.content.messages!['claimGreetingProperty']!);
            expect(rememberMeLogoutConfig.content.text).toBe('Hi USERNAME');
        });

        it('should call remember me logout is not manual logout', () => {
            service.onFeatureInit();
            rememberMeLogoutConfig.whenReady.next();

            rememberMeService.tokenExists.and.returnValue(true);
            user.triggerEvent(new UserLogoutEvent());
            expect(rememberMeService.logout).toHaveBeenCalled();
        });

        it('should navigate on logout', () => {
            service.onFeatureInit();
            rememberMeLogoutConfig.whenReady.next();

            rememberMeService.tokenExists.and.returnValue(true);
            user.triggerEvent(new UserLogoutEvent(true));
            expect(navigation.goTo).toHaveBeenCalledWith('/remember-me-logout', { forceReload: false });
        });
    });
});
