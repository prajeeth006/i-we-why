import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CommonMessages, CookieName, LoginProvider, LoginProviderProfile, MessageLifetime, MessageScope, MessageType } from '@frontend/vanilla/core';
import { ProviderLoginOptions } from '@frontend/vanilla/shared/login-providers';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { UtilsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { LoginConfigMock } from '../../../features/login/test/login.mocks';
import { LoginProvidersService } from '../src/login-providers.service';
import { AppleProviderServiceMock } from './apple-provider-service.mock';
import { FacebookProviderServiceMock } from './facebook-provider-service.mock';
import { GoogleProviderServiceMock } from './google-provider-service.mock';

describe('LoginProvidersService', () => {
    let service: LoginProvidersService;
    let loginConfigMock: LoginConfigMock;
    let urlServiceMock: UrlServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let utilsServiceMock: UtilsServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let appleProviderServiceMock: AppleProviderServiceMock;
    let googleProviderServiceMock: GoogleProviderServiceMock;
    let facebookProviderServiceMock: FacebookProviderServiceMock;
    let parsedUrlMock: ParsedUrlMock;

    beforeEach(() => {
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        appleProviderServiceMock = MockContext.useMock(AppleProviderServiceMock);
        googleProviderServiceMock = MockContext.useMock(GoogleProviderServiceMock);
        facebookProviderServiceMock = MockContext.useMock(FacebookProviderServiceMock);
        parsedUrlMock = new ParsedUrlMock();
        // MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            providers: [LoginProvidersService, CommonMessages, MockContext.providers],
        });

        loginConfigMock.providers = {
            yahoo: {
                clientId: 'yahoo_clientId',
                redirectUrl: 'https://yahoo.com/{culture}/redirect',
                loginUrl: 'https://login.yahoo.com/',
                appendNonce: true,
            },
            google: {
                clientId: 'google_clientId',
                redirectUrl: 'https://google.com/{culture}/redirect',
                loginUrl: 'https://login.google.com/',
                appendNonce: true,
                welcomeDialog: false,
                sdkLogin: false,
            },
            apple: {
                clientId: 'apple_clientId',
                redirectUrl: 'https://apple.com/{culture}/redirect',
                loginUrl: 'https://login.apple.com/',
                appendNonce: true,
                sdkLogin: true,
            },
            facebook: {
                clientId: 'facebook_clientId',
                redirectUrl: 'https://facebook.com/{culture}/redirect',
                loginUrl: 'https://login.facebook.com/',
                appendNonce: false,
                welcomeDialog: false,
                sdkLogin: false,
            },
        };

        service = TestBed.inject(LoginProvidersService);
    });

    describe('initProvidersData', () => {
        it('should init profiles data if enabled', fakeAsync(() => {
            const providersProfileSpy = spyOn(service.providersProfile, 'next');
            const providerProfiles: LoginProviderProfile[] = [
                { provider: LoginProvider.APPLE },
                { provider: LoginProvider.GOOGLE },
                { provider: LoginProvider.FACEBOOK },
            ];

            appleProviderServiceMock.profile = of<any>(providerProfiles[0]);
            googleProviderServiceMock.profile = of<any>(providerProfiles[1]);
            facebookProviderServiceMock.profile = of<any>(providerProfiles[2]);

            service.initProvidersProfile();

            expect(appleProviderServiceMock.initProfile).toHaveBeenCalled();
            expect(googleProviderServiceMock.initProfile).toHaveBeenCalledOnceWith(loginConfigMock.providers[LoginProvider.GOOGLE]);
            expect(facebookProviderServiceMock.initProfile).toHaveBeenCalledOnceWith(loginConfigMock.providers[LoginProvider.FACEBOOK]);

            tick();

            expect(providersProfileSpy).toHaveBeenCalledOnceWith(providerProfiles);
        }));
    });

    describe('urlAuth', () => {
        it('should invoke Yahoo URL login', () => {
            const parsedUrlSpy = spyOn(parsedUrlMock.search, 'append');
            const loginUri = 'https://login.yahoo.com/';
            const options: ProviderLoginOptions = {
                provider: LoginProvider.YAHOO,
                redirectQueryParams: { trigger: 'login' },
            };

            cookieServiceMock.get.and.returnValue('fakeCookieValue');
            parsedUrlMock.absUrl.and.returnValue('https://login.yahoo.com/');
            urlServiceMock.parse.and.returnValue(parsedUrlMock);

            service.urlAuth(options);

            expect(parsedUrlSpy).toHaveBeenCalledWith('client_id', 'yahoo_clientId');
            expect(parsedUrlSpy).toHaveBeenCalledWith('redirect_uri', loginUri);
            expect(parsedUrlSpy).toHaveBeenCalledWith('trigger', 'login');
            expect(parsedUrlSpy).toHaveBeenCalledWith(CookieName.Nonce, 'fakeCookieValue');
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(loginUri);
        });

        it('should not append nonce if disabled', () => {
            loginConfigMock.providers[LoginProvider.YAHOO]!.appendNonce = false;
            parsedUrlMock.absUrl.and.returnValue('https://login.yahoo.com/');
            urlServiceMock.parse.and.returnValue(parsedUrlMock);

            const options: ProviderLoginOptions = {
                provider: LoginProvider.YAHOO,
            };

            service.urlAuth(options);

            expect(utilsServiceMock.generateGuid).not.toHaveBeenCalled();
            expect(cookieServiceMock.remove).not.toHaveBeenCalled();
            expect(cookieServiceMock.put).not.toHaveBeenCalled();
        });

        it('should show login error on fail', fakeAsync(() => {
            const options: ProviderLoginOptions = {
                provider: LoginProvider.YAHOO,
            };

            urlServiceMock.parse.and.returnValue(parsedUrlMock);

            service.urlAuth(options);

            expect(messageQueueServiceMock.clear).toHaveBeenCalled();
            expect(messageQueueServiceMock.add).toHaveBeenCalledOnceWith({
                scope: MessageScope.Login,
                html: '',
                type: MessageType.Error,
                lifetime: MessageLifetime.Single,
            });
        }));
    });

    describe('sdkAuth', () => {
        it('should invoke Apple SDK login', fakeAsync(() => {
            const options: ProviderLoginOptions = {
                provider: LoginProvider.APPLE,
            };

            utilsServiceMock.generateGuid.and.returnValue('123');
            urlServiceMock.parse.and.returnValue(parsedUrlMock);

            service.sdkAuth(options);

            expect(cookieServiceMock.remove).toHaveBeenCalledOnceWith(CookieName.Nonce);
            expect(utilsServiceMock.generateGuid).toHaveBeenCalled();
            expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.Nonce, '123');

            expect(appleProviderServiceMock.login).toHaveBeenCalledWith({
                signInOptions: {
                    clientId: 'apple_clientId',
                    nonce: 'undefined',
                },
                providerParameters: {
                    clientId: 'apple_clientId',
                    redirectUrl: 'https://apple.com/{culture}/redirect',
                    loginUrl: 'https://login.apple.com/',
                    appendNonce: true,
                    sdkLogin: true,
                },
                authUrl: jasmine.any(Object),
            });
        }));
    });
});
