import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AffordabilityDslValuesProvider } from '../src/affordability-dsl-values-provider';
import { AffordabilitySnapshotDetails } from '../src/affordability.models';
import { AffordabilityServiceMock } from './affordability.mock';

describe('AffordabilityDslValuesProvider', () => {
    let target: DslRecordable | undefined;
    let affordabilityServiceMock: AffordabilityServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    const snapshotDetails: AffordabilitySnapshotDetails = {
        affordabilityStatus: '1',
        employmentGroup: 'employed',
    };

    beforeEach(() => {
        affordabilityServiceMock = MockContext.useMock(AffordabilityServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, AffordabilityDslValuesProvider],
        });

        const provider = TestBed.inject(AffordabilityDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders().Affordability;
    });

    describe('Affordability', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target?.Level).toBe('');
            expect(target?.EmploymentGroup).toBe('');
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target?.Level).toThrowError(DSL_NOT_READY);
            expect(() => target?.EmploymentGroup).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            affordabilityServiceMock.snapshotDetails.next(snapshotDetails);

            expect(target?.Level).toBe('1');
            expect(target?.EmploymentGroup).toBe('employed');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is kyc status event', () => {
            affordabilityServiceMock.snapshotDetails.next(snapshotDetails);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['affordability']);
        });
    });
});
