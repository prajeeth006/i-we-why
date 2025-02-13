import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LimitsLogoutProvider } from '../../../features/logout/src/limits.logout-provider';
import { LogoutMessageType } from '../../../features/logout/src/logout.client-config';
import { LimitsServiceMock } from '../../../shared/limits/test/deposit-limits.mock';
import { LogoutConfigMock, LogoutResourceServiceMock } from './logout-config.mock';

describe('LimitsLogoutProvider', () => {
    let service: LimitsLogoutProvider;
    let limitsServiceMock: LimitsServiceMock;
    let logoutConfigMock: LogoutConfigMock;
    let logoutResourceServiceMock: LogoutResourceServiceMock;

    beforeEach(() => {
        limitsServiceMock = MockContext.useMock(LimitsServiceMock);
        logoutConfigMock = MockContext.useMock(LogoutConfigMock);
        logoutResourceServiceMock = MockContext.useMock(LogoutResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [LimitsLogoutProvider, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(LimitsLogoutProvider);
    });

    describe('onLogout', () => {
        it('should not set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE;

            service.onLogout();
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toBeUndefined();
        }));

        it('should set placeholders', fakeAsync(() => {
            logoutConfigMock.logoutMessage = LogoutMessageType.LOGOUT_MESSAGE_LIMITS;

            service.onLogout();

            limitsServiceMock.getToasterPlaceholders.resolve({});
            tick();

            expect(logoutResourceServiceMock.logoutPlaceholders).toEqual({});
        }));
    });
});
