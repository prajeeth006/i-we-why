import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { SessionFundSummaryServiceMock } from '../../../shared/session-fund-summary/test/session-fund-summary-service.mocks';
import { LogoutMessageType } from '../src/logout.client-config';
import { SessionSummaryLogoutProvider } from '../src/session-summary.logout-provider';
import { LogoutConfigMock, LogoutResourceServiceMock } from './logout-config.mock';

describe('SessionSummaryLogoutProvider', () => {
    let service: SessionSummaryLogoutProvider;
    let authServiceMock: AuthServiceMock;
    let logoutConfigMock: LogoutConfigMock;
    let sessionFundSummaryMock: SessionFundSummaryServiceMock;
    let logoutResourceServiceMock: LogoutResourceServiceMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        authServiceMock = MockContext.useMock(AuthServiceMock);
        logoutConfigMock = MockContext.useMock(LogoutConfigMock);
        sessionFundSummaryMock = MockContext.useMock(SessionFundSummaryServiceMock);
        logoutResourceServiceMock = MockContext.useMock(LogoutResourceServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [SessionSummaryLogoutProvider, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(SessionSummaryLogoutProvider);
    });

    describe('onLogout', () => {
        it('should not set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE;

            service.onLogout();
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toBeUndefined();
        }));

        it('should set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE_SESSION_SUMMARY;
            intlServiceMock.formatCurrency.withArgs(5).and.returnValue('5 EUR');
            intlServiceMock.formatCurrency.withArgs(323).and.returnValue('323 EUR');

            service.onLogout();
            tick();

            authServiceMock.duration.resolve('02:01:03');
            tick();
            sessionFundSummaryMock.refresh.resolve({ profit: 10, loss: 5, currentBalance: 323 });
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toEqual({
                balance: '323 EUR',
                timeElapsed: '02:01:03',
                winningsLosses: '5 EUR',
            });
        }));
    });
});
