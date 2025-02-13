import { LoginNavigationService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: LoginNavigationService })
export class LoginNavigationServiceMock {
    @Stub() init: jasmine.Spy;
    @Stub() goToRegistration: jasmine.Spy;
    @Stub() storeReturnUrlFromQuerystring: jasmine.Spy;
    @Stub() goToStoredReturnUrl: jasmine.Spy;
    @Stub() getStoredLoginRedirect: jasmine.Spy;
    @Stub() goToWithCurrentLang: jasmine.Spy;
    @Stub() storeReturnUrl: jasmine.Spy;
    @Stub() goToLogin: jasmine.Spy;
    isRedirectAfterSessionTimeoutEnabled: boolean = true;
}
