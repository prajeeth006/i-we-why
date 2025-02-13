import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { UserSummary } from '@frontend/vanilla/shared/user-summary';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserSummaryDslValuesProvider } from '../../../features/user-summary/src/user-summary-dsl-values-provider';
import { UserSummaryServiceMock } from '../../../shared/user-summary/test/user-summary.service.mock';

describe('UserSummaryDslValuesProvider', () => {
    let target: DslRecordable;
    let userSummaryServiceMock: UserSummaryServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        userSummaryServiceMock = MockContext.useMock(UserSummaryServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, UserSummaryDslValuesProvider],
        });

        const provider = TestBed.inject<UserSummaryDslValuesProvider>(UserSummaryDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['UserSummary']!;
    });

    describe('UserSummary', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            userSummaryServiceMock.getSummary.next(UserSummary);

            expect(target['Loss']).toEqual(-1);
            expect(target['Profit']).toEqual(-1);
            expect(target['NetLoss']).toEqual(-1);
            expect(target['NetProfit']).toEqual(-1);
            expect(target['TotalDepositAmount']).toEqual(-1);
            expect(target['TotalWithdrawalAmount']).toEqual(-1);
            expect(target['PokerTaxCollected']).toEqual(-1);
            expect(target['CasinoTaxCollected']).toEqual(-1);
            expect(target['SportsTaxCollected']).toEqual(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Loss']).toThrowError(DSL_NOT_READY);
            expect(() => target['Profit']).toThrowError(DSL_NOT_READY);
            expect(() => target['NetLoss']).toThrowError(DSL_NOT_READY);
            expect(() => target['NetProfit']).toThrowError(DSL_NOT_READY);
            expect(() => target['TotalDepositAmount']).toThrowError(DSL_NOT_READY);
            expect(() => target['TotalWithdrawalAmount']).toThrowError(DSL_NOT_READY);
            expect(() => target['PokerTaxCollected']).toThrowError(DSL_NOT_READY);
            expect(() => target['CasinoTaxCollected']).toThrowError(DSL_NOT_READY);
            expect(() => target['SportsTaxCollected']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            userSummaryServiceMock.getSummary.next(UserSummary);

            expect(target['Loss']).toEqual(200);
            expect(target['Profit']).toEqual(100);
            expect(target['NetLoss']).toEqual(200);
            expect(target['NetProfit']).toEqual(100);
            expect(target['TotalDepositAmount']).toEqual(300);
            expect(target['TotalWithdrawalAmount']).toEqual(50);
            expect(target['PokerTaxCollected']).toEqual(10);
            expect(target['CasinoTaxCollected']).toEqual(20);
            expect(target['SportsTaxCollected']).toEqual(69);
        });

        it('Format should format currency', () => {
            userServiceMock.isAuthenticated = true;
            userSummaryServiceMock.getSummary.next(UserSummary);

            const value = target['Loss'];
            target['Format'](value);

            expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(value);
        });
    });

    describe('subscription', () => {
        it('should invalidate cache and update value if there is kyc status event', () => {
            userSummaryServiceMock.getSummary.next(UserSummary);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['userSummary']);
        });
    });

    const UserSummary: UserSummary = {
        isEnabled: true,
        profit: 100,
        loss: 200,
        netProfit: 100,
        netLoss: 200,
        totalDepositamount: 300,
        totalWithdrawalamount: 50,
        pokerTaxCollected: 10,
        casinoTaxCollected: 20,
        sportsTaxCollected: 69,
    };
});
