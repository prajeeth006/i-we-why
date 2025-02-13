import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class PlayerGamingDeclarationTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackLoad(isPostLogin: boolean) {
        this.track('contentView', 'load', 'updated tnc interceptor', isPostLogin);
    }

    trackAccept(isPostLogin: boolean) {
        this.track('Event.Tracking', 'click', 'accept cta', isPostLogin);
    }

    private track(eventName: string, action: string, details: string, isPostLogin: boolean) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'interceptor',
            'component.LabelEvent': 'updated tnc interceptor',
            'component.ActionEvent': action,
            'component.PositionEvent': isPostLogin ? 'post login' : 'product switch',
            'component.LocationEvent': 'updated tnc interceptor',
            'component.EventDetails': details,
            'component.URLClicked': 'not applicable',
        });
    }
}
