import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { CurfewStatusDslValuesProvider } from '../src/curfew-status-dsl-values-provider';
import { CurfewStatusServiceMock } from './curfew-status.mock';

describe('CurfewStatusDslValuesProvider', () => {
    let target: DslRecordable;
    let curfewStatusServiceMock: CurfewStatusServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        curfewStatusServiceMock = MockContext.useMock(CurfewStatusServiceMock);
        MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, CurfewStatusDslValuesProvider],
        });

        const provider = TestBed.inject(CurfewStatusDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['CurfewStatus']!;
    });

    describe('CurfewStatus', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['IsDepositCurfewOn']).toBeFalse();
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['IsDepositCurfewOn']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            curfewStatusServiceMock.curfewStatuses.next({ isDepositCurfewOn: true });

            expect(target['IsDepositCurfewOn']).toBeTrue();
        });
    });
});
