import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { DepositLimit } from '@frontend/vanilla/shared/limits';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { DepositLimitsDslValuesProvider } from '../../../features/deposit-limits/src/deposit-limits-dsl-values-provider';
import { DepositLimitsConfigMock, DepositLimitsServiceMock } from '../../../shared/limits/test/deposit-limits.mock';

describe('DepositLimitsDslValuesProvider', () => {
    let target: DslRecordable;
    let depositLimitsServiceMock: DepositLimitsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    let depositLimitsConfigMock: DepositLimitsConfigMock;
    let depositLimits: DepositLimit[];

    beforeEach(() => {
        depositLimitsServiceMock = MockContext.useMock(DepositLimitsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        depositLimitsConfigMock = MockContext.useMock(DepositLimitsConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, DepositLimitsDslValuesProvider],
        });

        const provider = TestBed.inject(DepositLimitsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['DepositLimits']!;

        depositLimits = [
            {
                currentLimit: 20,
                type: 'daily',
                limitSet: true,
            },
            {
                currentLimit: 30,
                type: 'weekly',
                limitSet: false,
            },
        ];
        depositLimitsConfigMock.lowThresholds = {
            daily: {
                '*': 30,
                'DIN': 40,
            },
            monthly: {
                '*': 20,
            },
            weekly: {
                '*': 50,
            },
            yearly: {},
        };
    });

    describe('DepositLimits', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Get']('daily')).toBe(-1);
            expect(target['IsLow']('daily')).toBeFalse();
        });

        it('should return not ready initially', () => {
            expect(() => target['Get']('daily')).toThrowError(DSL_NOT_READY);
            expect(() => target['IsLow']('daily')).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            depositLimitsServiceMock.limits.next(depositLimits);

            expect(target['Get']('daily')).toBe(20);
            expect(target['IsLow']('daily')).toBeTrue();
        });

        describe('Get', () => {
            it('should return default value when limit is not set', () => {
                depositLimitsServiceMock.limits.next(depositLimits);

                expect(target['Get']('weekly')).toBe(-1);
                expect(target['Get']('test')).toBe(-1);
            });
        });

        describe('IsLow', () => {
            it('should return false when limit or threshold is not set', () => {
                depositLimitsServiceMock.limits.next(depositLimits);

                expect(target['IsLow']('weekly')).toBeFalse();
                expect(target['IsLow']('test')).toBeFalse();
                expect(target['IsLow']('weekly')).toBeFalse();
                expect(target['IsLow']('yearly')).toBeFalse();
            });

            it('should return false when limit is bigger then threshhold', () => {
                depositLimits[0]!.currentLimit = 50;
                depositLimitsServiceMock.limits.next(depositLimits);

                expect(target['IsLow']('daily')).toBeFalse();
            });

            it('should return true when limit and threshhold are equal', () => {
                depositLimits[0]!.currentLimit = 30;
                depositLimitsServiceMock.limits.next(depositLimits);

                expect(target['IsLow']('daily')).toBeTrue();
            });

            it('should check user currency', () => {
                userServiceMock.currency = 'DIN';
                depositLimits[0]!.currentLimit = 35;
                depositLimitsServiceMock.limits.next(depositLimits);

                expect(target['IsLow']('daily')).toBeTrue();
            });
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value on limits event', () => {
            depositLimitsServiceMock.limits.next(depositLimits);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['depositLimits.Get']);
        });
    });
});
