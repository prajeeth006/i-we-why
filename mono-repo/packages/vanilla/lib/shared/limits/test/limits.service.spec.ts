import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LimitsService } from '@frontend/vanilla/shared/limits';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { DepositLimitsServiceMock } from './deposit-limits.mock';
import { PlayerLimitsServiceMock } from './player-limits.service.mock';

describe('LimitsService', () => {
    let service: LimitsService;
    let depositLimitsServiceMock: DepositLimitsServiceMock;
    let playerLimitsServiceMock: PlayerLimitsServiceMock;
    let userMock: UserServiceMock;
    let intlServiceMock: IntlServiceMock;
    let commonMessagesMock: CommonMessagesMock;

    beforeEach(() => {
        depositLimitsServiceMock = MockContext.useMock(DepositLimitsServiceMock);
        playerLimitsServiceMock = MockContext.useMock(PlayerLimitsServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LimitsService],
        });

        service = TestBed.inject(LimitsService);
    });

    describe('getToasterPlaceholders', () => {
        beforeEach(() => {
            intlServiceMock.formatCurrency.and.callFake((value: number) => `${value} EUR`);
            userMock.displayName = 'user';
            userMock.lastLoginTimeFormatted = '11:12:13 AM';
            commonMessagesMock['Hours'] = 'hours';
            commonMessagesMock['DepositLimitType:DAILY'] = 'daily';
            commonMessagesMock['DepositLimitType:WEEKLY'] = 'weekly';
            commonMessagesMock['DepositLimitType:MONTHLY'] = 'monthly';
            commonMessagesMock['PlayerLimitType:LOGIN_TIME_PER_DAY_IN_MINUTES'] = 'daily';
            commonMessagesMock['PlayerLimitType:LOGIN_TIME_PER_WEEK_IN_MINUTES'] = 'weekly';
            commonMessagesMock['PlayerLimitType:LOGIN_TIME_PER_MONTH_IN_MINUTES'] = 'monthly';
        });

        it('should return data', fakeAsync(() => {
            const spy = jasmine.createSpy();

            service.getToasterPlaceholders().then(spy);

            depositLimitsServiceMock.get.completeWith({
                limits: [
                    { limitSet: true, type: 'DAILY', currentLimit: 5 },
                    { limitSet: false, type: 'MONTHLY', currentLimit: 5555 },
                    { limitSet: true, type: 'MONTHLY', currentLimit: 10 },
                    { limitSet: true, type: 'WEEKLY', currentLimit: 20 },
                ],
            });
            tick();
            playerLimitsServiceMock.get.completeWith({
                limits: [
                    { limitType: 'AUTOPAYOUT_LIMIT_ON_WINNING', currentLimit: 500 },
                    { limitType: 'LOGIN_TIME_PER_DAY_IN_MINUTES', currentLimit: 300 },
                    { limitType: 'LOGIN_TIME_PER_WEEK_IN_MINUTES', currentLimit: 360 },
                    { limitType: 'LOGIN_TIME_PER_MONTH_IN_MINUTES', currentLimit: 360 },
                ],
            });
            tick();

            expect(spy).toHaveBeenCalledWith({
                displayName: 'user',
                lastLoginTime: '11:12:13 AM',
                depositLimits: 'daily 5 EUR, monthly 10 EUR, weekly 20 EUR',
                sessionLimits: 'daily 5 hours, weekly 6 hours, monthly 6 hours',
                creditLimit: '500 EUR',
            });
        }));
    });
});
