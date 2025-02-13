import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthenticationDslValuesProvider } from '../../../src/dsl/value-providers/authentication-dsl-values-provider';
import { AuthServiceMock } from '../../auth/auth.mock';
import { LoggerMock } from '../../languages/logger.mock';

describe('AuthenticationDslValuesProvider', () => {
    let target: any;
    let provider: AuthenticationDslValuesProvider;
    let authServiceMock: AuthServiceMock;

    beforeEach(() => {
        authServiceMock = MockContext.useMock(AuthServiceMock);
        MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, AuthenticationDslValuesProvider],
        });

        provider = TestBed.inject(AuthenticationDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('Authentication', () => {
        beforeEach(() => {
            target = provider.getProviders()['Authentication'];
        });

        describe('Logout', () => {
            it('should logout', () => {
                target['Logout']();

                expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false });
            });
        });
    });
});
