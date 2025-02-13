import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { CurrentSessionConfigMock } from '../../login-duration/test/current-session.mock';
import { ActivityPopupService } from '../src/activity-popup.service';
import { ActivityPopupConfigMock, ActivityPopupCookieServiceMock, ActivityPopupOverlayServiceMock } from './activity-popup.mock';

describe('ActivityPopupService', () => {
    let service: ActivityPopupService;
    let timerServiceMock: TimerServiceMock;
    let activityPopupConfigMock: ActivityPopupConfigMock;
    let activityPopupCookieServiceMock: ActivityPopupCookieServiceMock;
    let currentSessionConfigMock: CurrentSessionConfigMock;

    beforeEach(() => {
        activityPopupConfigMock = MockContext.useMock(ActivityPopupConfigMock);
        timerServiceMock = MockContext.useMock(TimerServiceMock);
        activityPopupCookieServiceMock = MockContext.useMock(ActivityPopupCookieServiceMock);
        currentSessionConfigMock = MockContext.useMock(CurrentSessionConfigMock);
        MockContext.useMock(ActivityPopupOverlayServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ActivityPopupService],
        });

        service = TestBed.inject(ActivityPopupService);
        currentSessionConfigMock.loginDuration = 50;
        activityPopupConfigMock.timeout = 500;
    });

    describe('setTimer', () => {
        it('call setTimeout when is config is enabled', () => {
            service.setTimer();

            expect(timerServiceMock.clearTimeout).toHaveBeenCalled();
            expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.anything(), 450);
        });

        it('do not call setTimeout when cookie exists', () => {
            activityPopupCookieServiceMock.read.and.returnValue('1');
            service.setTimer();

            expect(timerServiceMock.clearTimeout).toHaveBeenCalled();
            expect(timerServiceMock.setTimeout).not.toHaveBeenCalled();
        });
    });
});
