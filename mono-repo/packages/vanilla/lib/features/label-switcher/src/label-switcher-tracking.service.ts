import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class LabelSwitcherTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackConfirmationOverlay(actionEvent: string, positionEvent: string, eventDetails: string) {
        this.track('switching states confirmation popup', actionEvent, positionEvent, eventDetails, 'not applicable');
    }

    trackDropDown(actionEvent: string, positionEvent: string, eventDetails: string, urlClicked?: string) {
        this.track('Footer State Switcher', actionEvent, positionEvent, eventDetails, urlClicked);
    }

    private track(labelEvent: string, actionEvent: string, positionEvent: string, eventDetails: string, urlClicked?: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'multi state-switch',
            'component.LabelEvent': labelEvent,
            'component.ActionEvent': actionEvent,
            'component.PositionEvent': positionEvent,
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': eventDetails,
            'component.URLClicked': urlClicked || 'not applicable',
        });
    }
}
