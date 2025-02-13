import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BettingStatusDslValuesProvider } from '../src/betting-status-dsl-values-provider';
import { BettingStatusServiceMock } from './betting-status.mocks';

describe('BettingStatusDslValuesProvider', () => {
    let target: DslRecordable;
    let bettingStatusServiceMock: BettingStatusServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        bettingStatusServiceMock = MockContext.useMock(BettingStatusServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, BettingStatusDslValuesProvider],
        });

        const provider = TestBed.inject(BettingStatusDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders().BettingStatus!;
    });

    describe('KycStatus', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target.UserHasBets).toBeFalse();
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target.UserHasBets).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            bettingStatusServiceMock.bettingStatus.next({ hasBets: true });

            expect(target.UserHasBets).toBeTrue();
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is kyc status event', () => {
            bettingStatusServiceMock.bettingStatus.next({ hasBets: true });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['bettingStatus']);
        });
    });
});
