import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserSummaryServiceMock } from '../../../shared/user-summary/test/user-summary.service.mock';
import { LogoutMessageType } from '../src/logout.client-config';
import { StatsLogoutProvider } from '../src/stats.logout-provider';
import { LogoutConfigMock, LogoutResourceServiceMock } from './logout-config.mock';

describe('StatsLogoutProvider', () => {
    let service: StatsLogoutProvider;
    let userMock: UserServiceMock;
    let authServiceMock: AuthServiceMock;
    let logoutConfigMock: LogoutConfigMock;
    let userSummaryServiceMock: UserSummaryServiceMock;
    let logoutResourceServiceMock: LogoutResourceServiceMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        logoutConfigMock = MockContext.useMock(LogoutConfigMock);
        userSummaryServiceMock = MockContext.useMock(UserSummaryServiceMock);
        logoutResourceServiceMock = MockContext.useMock(LogoutResourceServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [StatsLogoutProvider, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(StatsLogoutProvider);
    });

    describe('onLogout', () => {
        it('should not set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE;

            service.onLogout();
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toBeUndefined();
        }));

        it('should set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE_WITH_STATS;
            userMock.displayName = 'red';
            intlServiceMock.formatCurrency.withArgs(5).and.returnValue('5 EUR');
            intlServiceMock.formatCurrency.withArgs(10).and.returnValue('10 EUR');

            service.onLogout();
            tick();

            authServiceMock.duration.resolve('02:01:03');
            tick();
            userSummaryServiceMock.refresh.resolve({ profit: 5, loss: 10 });
            tick();
            logoutResourceServiceMock.getCurrentSessionProfitLoss.completeWith({ totalReturn: 5, totalStake: 10 });
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toEqual({
                displayName: 'red',
                timeElapsed: '02:01:03',
                profit: '5 EUR',
                loss: '10 EUR',
                totalReturn: '5 EUR',
                totalStake: '10 EUR',
            });
        }));
    });
});
