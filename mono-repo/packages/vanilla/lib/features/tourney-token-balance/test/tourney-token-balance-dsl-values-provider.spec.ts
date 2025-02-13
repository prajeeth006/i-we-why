import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { TourneyTokenBalanceDslValuesProvider } from '../src/tourney-token-balance-dsl-values-provider';
import { TourneyTokenBalanceServiceMock } from './tourney-token-balance.mock';

describe('TourneyTokenBalanceDslValuesProvider', () => {
    let target: DslRecordable;
    let tourneyTokenBalanceServiceMock: TourneyTokenBalanceServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        tourneyTokenBalanceServiceMock = MockContext.useMock(TourneyTokenBalanceServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, TourneyTokenBalanceDslValuesProvider],
        });

        const provider = TestBed.inject(TourneyTokenBalanceDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['TourneyTokenBalance']!;
    });

    describe('TourneyTokenBalance', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Balance']).toBe(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Balance']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            tourneyTokenBalanceServiceMock.tourneyTokenBalance.next({
                tourneyTokenBalance: 10,
                tourneyTokenCurrencyCode: 'EUR',
            });

            expect(target['Balance']).toBe(10);
            expect(target['Currency']).toBe('EUR');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value on event', () => {
            tourneyTokenBalanceServiceMock.tourneyTokenBalance.next({ tourneyTokenBalance: 10, tourneyTokenCurrencyCode: 'EUR' });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['tourneyTokenBalance']);
        });
    });
});
