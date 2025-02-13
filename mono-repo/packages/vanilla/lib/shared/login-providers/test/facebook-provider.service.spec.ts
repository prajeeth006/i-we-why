import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { DynamicScriptsServiceMock } from '../../browser/test/dynamic-scripts-service.mock';
import { FacebookProviderService } from '../src/facebook-provider.service';
import { AuthOptions } from '../src/login-providers.models';

describe('FacebookProviderService', () => {
    let service: FacebookProviderService;
    let dynamicScriptsServiceMock: DynamicScriptsServiceMock;
    let authOptions: AuthOptions;

    beforeEach(() => {
        dynamicScriptsServiceMock = MockContext.useMock(DynamicScriptsServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(TrackingServiceMock);

        authOptions = {
            authUrl: { url: null, redirectUrl: null },
            providerParameters: {
                clientId: 'facebook_clientId',
                sdkUrl: 'facebook_sdkUrl',
                sdkCookie: true,
                sdkVersion: 'facebook_sdkVersion',
                loginUrl: '',
                redirectUrl: '',
                appendNonce: false,
                welcomeDialog: false,
                sdkLogin: true,
            },
        };

        TestBed.configureTestingModule({
            providers: [FacebookProviderService, MockContext.providers],
        });

        service = TestBed.inject(FacebookProviderService);
    });

    describe('login', () => {
        it('should load SDK if enabled', fakeAsync(() => {
            service.login(authOptions);
            tick();

            expect(dynamicScriptsServiceMock.load).toHaveBeenCalledWith('facebook_sdkUrl', {
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
        it('should resolve if provider is enabled', fakeAsync(() => {
            service.initProfile(authOptions.providerParameters);
            tick();

            expect(dynamicScriptsServiceMock.load).toHaveBeenCalledWith('facebook_sdkUrl', {
                async: true,
                defer: true,
                crossorigin: 'anonymous',
                onloadCallback: jasmine.any(Function),
            });
        }));
    });
});
