import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CookieName, LoginProvider, LoginProviderProfile } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { DynamicScriptsServiceMock } from '../../browser/test/dynamic-scripts-service.mock';
import { CryptoServiceMock } from '../../crypto/test/crypto.service.mock';
import { AppleProviderService } from '../src/apple-provider.service';
import { AuthOptions } from '../src/login-providers.models';

describe('AppleProviderService', () => {
    let service: AppleProviderService;
    let cookieServiceMock: CookieServiceMock;
    let cryptoServiceMock: CryptoServiceMock;
    let dynamicScriptsServiceMock: DynamicScriptsServiceMock;
    let authOptions: AuthOptions;

    beforeEach(() => {
        dynamicScriptsServiceMock = MockContext.useMock(DynamicScriptsServiceMock);
        cryptoServiceMock = MockContext.useMock(CryptoServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(LoggerMock);

        authOptions = {
            authUrl: { url: null, redirectUrl: null },
            providerParameters: {
                clientId: `${LoginProvider.APPLE}_clientId`,
                sdkUrl: `${LoginProvider.APPLE}_sdkUrl`,
                sdkCookie: true,
                sdkVersion: `${LoginProvider.APPLE}_sdkVersion`,
                loginUrl: '',
                redirectUrl: '',
                appendNonce: false,
                welcomeDialog: false,
                sdkLogin: true,
            },
        };

        TestBed.configureTestingModule({
            providers: [AppleProviderService, MockContext.providers],
        });

        service = TestBed.inject(AppleProviderService);
    });

    describe('login', () => {
        it('should load SDK if enabled', fakeAsync(() => {
            service.login(authOptions);
            tick();

            expect(dynamicScriptsServiceMock.load).toHaveBeenCalledOnceWith(`${LoginProvider.APPLE}_sdkUrl`, {
                async: true,
                defer: true,
                crossorigin: 'anonymous',
                onloadCallback: jasmine.any(Function),
            });
        }));

        it('should not load SDK if disabled', fakeAsync(() => {
            authOptions.providerParameters!.sdkLogin = false;

            service.login(authOptions);
            tick();

            expect(dynamicScriptsServiceMock.load).not.toHaveBeenCalled();
        }));

        it('should not load SDK if sdkUrl is missing', fakeAsync(() => {
            authOptions.providerParameters!.sdkUrl = '';

            service.login(authOptions);
            tick();

            expect(dynamicScriptsServiceMock.load).not.toHaveBeenCalled();
        }));
    });

    describe('initProfile', () => {
        it('should return default value if no profile data stored', () => {
            service.initProfile();

            service.profile.subscribe((profile: LoginProviderProfile | null) => {
                expect(profile).toEqual({ provider: LoginProvider.APPLE });
            });

            expect(cryptoServiceMock.decrypt).not.toHaveBeenCalled();
        });

        it('should get user profile from cookies', () => {
            cookieServiceMock.get.withArgs(CookieName.AppleUser).and.returnValue('test');
            cookieServiceMock.get.withArgs(CookieName.Nonce).and.returnValue('nonce');

            service.initProfile();

            expect(cryptoServiceMock.decrypt).toHaveBeenCalledOnceWith('test', 'nonce');
        });
    });
});
