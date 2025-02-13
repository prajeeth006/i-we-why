import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class ActivityPopupTrackingService {
    constructor(private trackingService: TrackingService) {}

    load(positionEvent: number) {
        this.track('contentView', 'load', positionEvent, 'activity popup');
    }

    continue(positionEvent: number) {
        this.track('Event.Tracking', 'click', positionEvent, 'continue');
    }

    logout(positionEvent: number) {
        this.track('Event.Tracking', 'click', positionEvent, 'log out');
    }

    private track(eventName: string, actionEvent: string, positionEvent: number, eventDetails: string) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'interceptor',
            'component.ActionEvent': actionEvent,
            'component.PositionEvent': positionEvent,
            'component.LocationEvent': 'activity popup',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
}
