import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SessionLimitsLogoutPopupProcessor } from '../src/session-limits-logout-popup-processor';
import { SessionLimitsLogoutPopupConfigMock, SessionLimitsLogoutPopupServiceMock } from './session-limits-logout-popup.mock';

describe('SessionLimitsLogoutPopupProcessor', () => {
    let service: SessionLimitsLogoutPopupProcessor;

    let sessionLimitsLogoutPopupServiceMock: SessionLimitsLogoutPopupServiceMock;
    let sessionLimitsLogoutPopupConfigMock: SessionLimitsLogoutPopupConfigMock;

    beforeEach(() => {
        sessionLimitsLogoutPopupServiceMock = MockContext.useMock(SessionLimitsLogoutPopupServiceMock);
        sessionLimitsLogoutPopupConfigMock = MockContext.useMock(SessionLimitsLogoutPopupConfigMock);

        TestBed.configureTestingModule({
            providers: [SessionLimitsLogoutPopupProcessor, MockContext.providers],
        });
        service = TestBed.inject(SessionLimitsLogoutPopupProcessor);
    });

    describe('process', () => {
        it('should show overlay when AUTO_LOGOUT_EVENT_WITH_POPUP RTMS message is received', fakeAsync(() => {
            service.process({
                type: EventType.Rtms,
                name: 'AUTO_LOGOUT_EVENT_WITH_POPUP',
                data: {
                    accountName: 'br_sdsad0994',
                    currentLimit: 360,
                },
            });
            sessionLimitsLogoutPopupConfigMock.whenReady.next();
            tick();

            expect(sessionLimitsLogoutPopupServiceMock.show).toHaveBeenCalledWith(360);
        }));
    });
});
