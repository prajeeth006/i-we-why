import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { SessionFundSummary } from '@frontend/vanilla/shared/session-fund-summary';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SessionFundSummaryServiceMock } from '../../../shared/session-fund-summary/test/session-fund-summary-service.mocks';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { SessionFundSummaryDslValuesProvider } from '../src/session-fund-summary-dsl-values-provider';

describe('SessionFundSummaryDslValuesProvider', () => {
    let target: DslRecordable | undefined;
    let sessionFundSummaryServiceMock: SessionFundSummaryServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;

    beforeEach(() => {
        sessionFundSummaryServiceMock = MockContext.useMock(SessionFundSummaryServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, SessionFundSummaryDslValuesProvider],
        });

        const provider = TestBed.inject<SessionFundSummaryDslValuesProvider>(SessionFundSummaryDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders().SessionFundSummary;
    });

    describe('SessionFundSummary', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            sessionFundSummaryServiceMock.getSummary.next(sessionSummary);

            expect(target?.Loss).toEqual(-1);
            expect(target?.Profit).toEqual(-1);
            expect(target?.TotalStake).toEqual(-1);
            expect(target?.InitialBalance).toEqual(-1);
            expect(target?.CurrentBalance).toEqual(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target?.Loss).toThrowError(DSL_NOT_READY);
            expect(() => target?.Profit).toThrowError(DSL_NOT_READY);
            expect(() => target?.TotalStake).toThrowError(DSL_NOT_READY);
            expect(() => target?.InitialBalance).toThrowError(DSL_NOT_READY);
            expect(() => target?.CurrentBalance).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            sessionFundSummaryServiceMock.getSummary.next(sessionSummary);

            expect(target?.Profit).toEqual(100);
            expect(target?.Loss).toEqual(200);
            expect(target?.TotalStake).toEqual(300);
            expect(target?.InitialBalance).toEqual(100);
            expect(target?.CurrentBalance).toEqual(400);
        });
    });

    describe('subscription', () => {
        it('should invalidate cache and update value if there is get summary event', () => {
            sessionFundSummaryServiceMock.getSummary.next(sessionSummary);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['sessionFundSummary']);
        });

        it('should refresh summary if balance refresh requested', () => {
            balancePropertiesServiceMock.balanceProperties.next(<any>{ propagateRefresh: true, accountBalance: 100 });

            expect(sessionFundSummaryServiceMock.refresh).toHaveBeenCalledWith();
        });
    });

    const sessionSummary: SessionFundSummary = {
        profit: 100,
        loss: 200,
        totalStake: 300,
        currentBalance: 400,
        initialBalance: 100,
    };
});
