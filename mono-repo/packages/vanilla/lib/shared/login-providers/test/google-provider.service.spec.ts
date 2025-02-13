import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { DynamicScriptsServiceMock } from '../../browser/test/dynamic-scripts-service.mock';
import { GoogleProviderService } from '../src/google-provider.service';
import { AuthOptions } from '../src/login-providers.models';

describe('GoogleProviderService', () => {
    let service: GoogleProviderService;
    let dynamicScriptsServiceMock: DynamicScriptsServiceMock;
    let authOptions: AuthOptions;

    beforeEach(() => {
        dynamicScriptsServiceMock = MockContext.useMock(DynamicScriptsServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(LoggerMock);

        authOptions = {
            authUrl: { url: null, redirectUrl: null },
            providerParameters: {
                clientId: 'google_clientId',
                sdkUrl: 'google_sdkUrl',
                sdkCookie: true,
                sdkVersion: 'google_sdkVersion',
                loginUrl: '',
                redirectUrl: '',
                appendNonce: false,
                welcomeDialog: false,
                sdkLogin: true,
            },
        };

        TestBed.configureTestingModule({
            providers: [GoogleProviderService, MockContext.providers],
        });

        service = TestBed.inject(GoogleProviderService);
    });

    describe('login', () => {
        it('should load SDK if enabled', fakeAsync(() => {
            service.login(authOptions);
            tick();

            expect(dynamicScriptsServiceMock.load).toHaveBeenCalledWith('google_sdkUrl', {
                async: true,
                defer: true,
                crossorigin: 'anonymous',
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

            expect(dynamicScriptsServiceMock.load).toHaveBeenCalledWith('google_sdkUrl', {
                async: true,
                defer: true,
                crossorigin: 'anonymous',
            });
        }));
    });
});
