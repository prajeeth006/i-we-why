import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslValueAsyncResolverMock } from '../../../core/test/dsl/value-providers/dsl-value-async-resolver.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LicenseInfoDslValuesProvider } from '../src/license-info-dsl-values-provider';

describe('LicenseInfoDslValuesProvider', () => {
    let target: DslRecordable;
    let userServiceMock: UserServiceMock;
    let dslValueAsyncResolverMock: DslValueAsyncResolverMock;

    beforeEach(() => {
        dslValueAsyncResolverMock = MockContext.useMock(DslValueAsyncResolverMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, LicenseInfoDslValuesProvider],
        });

        const provider = TestBed.inject(LicenseInfoDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['LicenseInfo']!;
    });

    describe('AcceptanceNeeded', () => {
        it('should return false when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            expect(target['AcceptanceNeeded']).toBeFalse();
        });

        it('should return value when user is authenticated', () => {
            dslValueAsyncResolverMock.resolve.and.returnValue(true);
            expect(target['AcceptanceNeeded']).toBeTrue();
        });
    });
});
