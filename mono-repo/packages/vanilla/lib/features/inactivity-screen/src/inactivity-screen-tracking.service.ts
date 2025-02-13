import { Injectable } from '@angular/core';

import { Page, TrackingService } from '@frontend/vanilla/core';

import { InactivityMode } from './inactivity-screen.models';

@Injectable({
    providedIn: 'root',
})
export class InactivityScreenTrackingService {
    constructor(
        private trackingService: TrackingService,
        private page: Page,
    ) {}

    trackShowOverlay(seconds: number, mode: string) {
        if (mode === InactivityMode.Betstation) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'reality check',
                'component.LabelEvent': 'idle status',
                'component.ActionEvent': 'load',
                'component.PositionEvent': seconds,
                'component.LocationEvent': 'inactivity prompt',
                'component.EventDetails': 'inactivity prompt',
                'component.URLClicked': 'not applicable',
            });
        } else {
            this.trackingService.triggerEvent('contentView', {
                'component.CategoryEvent': 'session inactivity',
                'component.LabelEvent': 'idle popup-about to be logged out',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': this.page.product, //ex home, casino, poker, etc
                'component.EventDetails': 'idle popup-about to be logged out',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    trackContinue() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-about to be logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-about to be logged out',
            'component.EventDetails': 'stay logged in',
            'component.URLClicked': 'not applicable',
        });
    }

    async trackLogout() {
        await this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-about to be logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-about to be logged out',
            'component.EventDetails': 'logout',
            'component.URLClicked': 'not applicable',
        });
    }

    trackClick(remainingTime: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'idle status',
            'component.ActionEvent': 'click',
            'component.PositionEvent': remainingTime,
            'component.LocationEvent': 'inactivity prompt',
            'component.EventDetails': 'inactivity prompt',
            'component.URLClicked': 'not applicable',
        });
    }

    trackSessionOverlay() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': this.page.product, //ex home, casino, poker, etc
            'component.EventDetails': 'idle popup-logged out',
            'component.URLClicked': 'not applicable',
        });
    }

    async trackLogin() {
        await this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-logged out',
            'component.EventDetails': 'log back in',
            'component.URLClicked': 'not applicable',
        });
    }

    trackSessionClose() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'close',
            'component.PositionEvent': 'icon',
            'component.LocationEvent': 'idle popup-logged out',
            'component.EventDetails': 'close x',
            'component.URLClicked': 'not applicable',
        });
    }

    trackSessionOk() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-logged out',
            'component.EventDetails': 'ok',
            'component.URLClicked': 'not applicable',
        });
    }

    trackSession(sessionId: string | null) {
        this.trackingService.triggerEvent('Session.End', {
            'betstation.sessionID': sessionId,
        });
    }
}
