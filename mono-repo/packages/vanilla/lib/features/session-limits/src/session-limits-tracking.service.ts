import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

import { SessionLimit, SessionLimitNotification, SessionLimitType } from './session-limits.models';

@Injectable()
export class SessionLimitsTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackLoad(sessionLimitsNotification: SessionLimitNotification) {
        if (sessionLimitsNotification.isSessionExpired) {
            this.trackSessionLimitsEvent(
                sessionLimitsNotification.sessionLimits,
                'Load',
                'Single Session Duration Limits pop-up',
                'Single Session Duration Limits pop-up',
            );
        } else {
            this.trackSessionLimitsEvent(
                sessionLimitsNotification.sessionLimits,
                'Load',
                'not applicable',
                'Real Time Session Duration Limits pop-up',
            );
        }
    }

    trackLoadV3(sessionLimitsNotification: SessionLimitNotification) {
        const positionEvent =
            sessionLimitsNotification.fromSource && sessionLimitsNotification.fromSource === 'postlogin'
                ? 'post login interceptor'
                : 'active session popup';

        this.track(
            'load',
            positionEvent,
            'session limit alert',
            'session limit alert',
            'Event.ContentView',
            'time management - session  time limits',
        );
    }

    trackClickV3(sessionLimitsNotification: SessionLimitNotification, ctaName: string, url?: string) {
        const positionEvent =
            sessionLimitsNotification.fromSource && sessionLimitsNotification.fromSource === 'postlogin'
                ? 'post login interceptor'
                : 'active session popup';

        this.track(
            'click',
            positionEvent,
            'session limit alert',
            ctaName,
            'Event.Tracking',
            'time management - session  time limits',
            url ? url : 'not applicable',
        );
    }

    trackClose(sessionLimitsNotification: SessionLimitNotification) {
        this.trackSessionLimitsEvent(
            sessionLimitsNotification.sessionLimits,
            'Click',
            sessionLimitsNotification.isSessionExpired ? 'Single Session Duration Limits pop-up' : 'Real Time Session Duration Limits pop-up',
            'Close',
        );
    }

    trackSessionLimitsEvent(sessionLimits: SessionLimit[], action: string, location: string, details: string) {
        const limitsType = this.getLimitsType(sessionLimits);
        this.track(action, limitsType, location, details, 'Event.OptionLoad', 'Time Management - Session Duration Limits');
    }

    trackSingleSessionLimitEvent(action: string, location: string, details: string) {
        this.track(action, 'not applicable', location, details, 'Event.OptionLoad', 'Time Management - Session Duration Limits');
    }

    getLimitsType(sessionLimits: SessionLimit[]): string {
        return sessionLimits?.reduce(
            (acc: string, current: SessionLimit) =>
                current.sessionLimitType ? `${acc ? acc + '/' : ''}${SessionLimitType[current.sessionLimitType]}` : acc,
            '',
        );
    }

    private track(action: string, position: string, location: string, details: string, eventName: string, labelEvent: string, urlClicked?: string) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'Gambling Controls',
            'component.LabelEvent': labelEvent,
            'component.ActionEvent': action,
            'component.PositionEvent': position,
            'component.LocationEvent': location,
            'component.EventDetails': details,
            'component.URLClicked': urlClicked ? urlClicked : 'not applicable',
        });
    }
}
