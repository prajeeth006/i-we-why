import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class ProductMenuTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackProductMenuClose() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'navigation',
            'component.LabelEvent': 'burger menu',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'navigation menu',
            'component.EventDetails': 'close',
            'component.URLClicked': 'not applicable',
        });
    }
}
