import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BonusBalanceDslValuesProvider } from '../src/bonus-balance-dsl-values-provider';
import { BonusBalanceServiceMock } from './bonus-balance.mock';

describe('BonusBalanceDslValuesProvider', () => {
    let target: DslRecordable;
    let bonusBalanceServiceMock: BonusBalanceServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userMock: UserServiceMock;

    beforeEach(() => {
        bonusBalanceServiceMock = MockContext.useMock(BonusBalanceServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, BonusBalanceDslValuesProvider],
        });

        const provider = TestBed.inject(BonusBalanceDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['BonusBalance']!;
    });

    describe('Get', () => {
        it('should return -1 if unauthenticated user', () => {
            userMock.isAuthenticated = false;

            expect(target['Get']('CASINO')).toBe(-1);
            expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should return not ready initially and trigger a refresh', () => {
            expect(() => target['Get']('CASINO')).toThrowError(DSL_NOT_READY);

            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalledWith();
        });

        it('should get value for specified product once loaded', () => {
            bonusBalanceServiceMock.bonusBalance.next({ CASINO: 5 });

            expect(target['Get']('CASINO')).toBe(5);
        });

        it('should return 0 if product is not defined', () => {
            bonusBalanceServiceMock.bonusBalance.next({ CASINO: 5 });

            expect(target['Get']('SPORTS')).toBe(0);
        });

        it('should not call refresh if value was already received', () => {
            bonusBalanceServiceMock.bonusBalance.next({ CASINO: 5 });
            bonusBalanceServiceMock.refresh.calls.reset();

            expect(target['Get']('CASINO')).toBe(5);

            expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should call refresh only once', () => {
            bonusBalanceServiceMock.refresh.calls.reset();

            expect(() => target['Get']('CASINO')).toThrowError(DSL_NOT_READY);
            expect(() => target['Get']('CASINO')).toThrowError(DSL_NOT_READY);

            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalledTimes(1);
        });
    });

    describe('GetBonusByType', () => {
        it('should return -1 if unauthenticated user', () => {
            userMock.isAuthenticated = false;

            expect(target['GetBonusByType']('CASINO')).toBe(-1);
            expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should return not ready initially and trigger a refresh', () => {
            expect(() => target['GetBonusByType']('CASINO')).toThrowError(DSL_NOT_READY);

            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalledWith();
        });

        it('should get value for specified product once loaded', () => {
            bonusBalanceServiceMock.bonusBalanceV4.next({
                bingo: { bonuses: [{ bonusAmount: 12, isBonusActive: true, applicableProducts: ['BINGO'] }] },
            });

            expect(target['GetBonusByType']('bingo')).toBe(12);
        });

        it('should get value for specified products once loaded', () => {
            bonusBalanceServiceMock.bonusBalanceV4.next({
                bingo: { bonuses: [{ bonusAmount: 12, isBonusActive: true, applicableProducts: ['BINGO'] }] },
                poker: { bonuses: [{ bonusAmount: 18, isBonusActive: true, applicableProducts: ['POKER'] }] },
            });

            expect(target['GetBonusByType']('bingo')).toBe(12);
            expect(target['GetBonusByType']('poker')).toBe(18);
        });

        it('should return 0 if product is not defined', () => {
            bonusBalanceServiceMock.bonusBalanceV4.next({
                bingo: { bonuses: [{ bonusAmount: 12, isBonusActive: true, applicableProducts: ['BINGO'] }] },
            });

            expect(target['GetBonusByType']('poker')).toBe(0);
        });

        it('should not call refresh if value was already received', () => {
            bonusBalanceServiceMock.bonusBalanceV4.next({
                bingo: { bonuses: [{ bonusAmount: 12, isBonusActive: true, applicableProducts: ['BINGO'] }] },
            });
            bonusBalanceServiceMock.refresh.calls.reset();

            expect(target['GetBonusByType']('bingo')).toBe(12);

            expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should call refresh only once', () => {
            bonusBalanceServiceMock.refresh.calls.reset();

            expect(() => target['GetBonusByType']('poker')).toThrowError(DSL_NOT_READY);
            expect(() => target['GetBonusByType']('poker')).toThrowError(DSL_NOT_READY);

            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalledTimes(1);
        });
    });

    describe('ThirdParty', () => {
        it('should return -1 if unauthenticated user', () => {
            userMock.isAuthenticated = false;

            expect(target['ThirdParty']).toBe(-1);
            expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should get value once loaded', () => {
            expect(target['ThirdParty']).toBe(0);
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is bonus balance event', () => {
            bonusBalanceServiceMock.bonusBalance.next({ CASINO: 2 });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['bonusBalance.Get']);
        });
    });
});
