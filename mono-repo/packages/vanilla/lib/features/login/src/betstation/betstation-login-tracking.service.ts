import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable({ providedIn: 'root' })
export class BetstationLoginTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackLoginPinShown() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'pin number screen',
            'component.EventDetails': 'pin number screen',
        });
    }

    trackErrorMessageShown(message: string) {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'error message',
            'component.EventDetails': message,
        });
    }

    trackErrorMessageOk(message: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'click',
            'component.PositionEvent': message,
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'ok',
        });
    }
}
