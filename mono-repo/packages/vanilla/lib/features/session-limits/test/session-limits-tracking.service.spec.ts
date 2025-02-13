import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { SessionLimitsTrackingService } from '../src/session-limits-tracking.service';
import { SessionLimitNotification, SessionLimitType } from '../src/session-limits.models';

describe('SessionLimitsTrackingService', () => {
    let service: SessionLimitsTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    const sessionLimitsNotification: SessionLimitNotification = {
        accountName: 'name',
        frontend: 'fe',
        useCase: 'use_case',
        sessionLimits: [
            {
                percentageElapsed: 82,
                sessionLimitConfiguredMins: 150,
                sessionLimitElaspedMins: 130,
                sessionLimitType: SessionLimitType.DAILY_LIMIT,
            },
            {
                percentageElapsed: 90,
                sessionLimitConfiguredMins: 150,
                sessionLimitElaspedMins: 130,
                sessionLimitType: SessionLimitType.WEEKLY_LIMIT,
            },
        ],
        isSessionExpired: false,
    };

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionLimitsTrackingService],
        });

        service = TestBed.inject(SessionLimitsTrackingService);
        sessionLimitsNotification.isSessionExpired = false;
    });

    describe('trackLoad', () => {
        it('should track realTime overlay load', () => {
            service.trackLoad(sessionLimitsNotification);
            verifyEventTriggered('Load', 'not applicable', 'Real Time Session Duration Limits pop-up');
        });

        it('should track single session limits overlay load', () => {
            sessionLimitsNotification.isSessionExpired = true;
            service.trackLoad(sessionLimitsNotification);
            verifyEventTriggered('Load', 'Single Session Duration Limits pop-up', 'Single Session Duration Limits pop-up');
        });
    });

    describe('trackClose', () => {
        it('should track realTime overlay close', () => {
            service.trackClose(sessionLimitsNotification);
            verifyEventTriggered('Click', 'Real Time Session Duration Limits pop-up', 'Close');
        });
        it('should track single session limits overlay close', () => {
            sessionLimitsNotification.isSessionExpired = true;
            service.trackClose(sessionLimitsNotification);
            verifyEventTriggered('Click', 'Single Session Duration Limits pop-up', 'Close');
        });
    });

    describe('getLimitsNotified', () => {
        it('should return the limits notified', () => {
            const limitsNotified = service.getLimitsType(sessionLimitsNotification.sessionLimits);

            expect(limitsNotified).toBe('DAILY_LIMIT/WEEKLY_LIMIT');
        });
    });

    function verifyEventTriggered(action: string, location: string, event: string) {
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.OptionLoad', {
            'component.CategoryEvent': 'Gambling Controls',
            'component.LabelEvent': 'Time Management - Session Duration Limits',
            'component.ActionEvent': action,
            'component.PositionEvent': 'DAILY_LIMIT/WEEKLY_LIMIT',
            'component.LocationEvent': location,
            'component.EventDetails': event,
            'component.URLClicked': 'not applicable',
        });
    }
});
