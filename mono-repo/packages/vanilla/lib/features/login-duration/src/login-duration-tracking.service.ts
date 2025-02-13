import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class LoginDurationTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackLoad(eventDetails: string, positionEvent: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login duration',
            'component.LabelEvent': 'time track start',
            'component.ActionEvent': 'load',
            'component.PositionEvent': positionEvent,
            'component.LocationEvent': 'not applicable', // add location if possible
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }

    async trackAnchorClick(eventName: string, trackingData: { [prop: string]: string }) {
        await this.trackingService.triggerEvent(eventName, trackingData);
    }
}
