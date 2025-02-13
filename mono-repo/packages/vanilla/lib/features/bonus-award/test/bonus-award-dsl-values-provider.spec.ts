import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslValueAsyncResolverMock } from '../../../core/test/dsl/value-providers/dsl-value-async-resolver.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BonusAwardDslValuesProvider } from '../src/bonus-award-dsl-values-provider';

describe('BonusAwardDslValuesProvider', () => {
    let target: DslRecordable;
    let userServiceMock: UserServiceMock;
    let dslValueAsyncResolverMock: DslValueAsyncResolverMock;

    beforeEach(() => {
        dslValueAsyncResolverMock = MockContext.useMock(DslValueAsyncResolverMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, BonusAwardDslValuesProvider],
        });

        const provider = TestBed.inject(BonusAwardDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['BonusAward']!;
    });

    describe('IsBonusAwarded', () => {
        it('should return false when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            expect(target['IsBonusAwarded']('123')).toBeFalse();
        });

        it('should return value when user is authenticated', () => {
            dslValueAsyncResolverMock.resolve.and.returnValue(true);
            expect(target['IsBonusAwarded']('123')).toBeTrue();
        });
    });
});
