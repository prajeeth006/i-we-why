import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

/**
 * @whatItDoes Provides tracking for balance breakdown page
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class BalanceBreakdownTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackExpandBalance(details: string, position: string, product?: string) {
        this.trackEvent('Event.Tracking', 'click', details, position, product);
    }

    trackProductLoad(details: string) {
        this.trackEvent('Event.Tracking', 'load', details);
    }

    trackInfoClick(position: string, details: string, product?: string) {
        this.trackEvent('Event.Tracking', 'click', details, position, product);
    }

    trackTutorialNavigation(position: string, details: string) {
        this.trackEvent('Event.Tracking', 'click', details, position);
    }

    trackBalanceItemLoad(text: string) {
        this.trackEvent('contentView', 'load', text);
    }

    private trackEvent(eventName: string, action: string, details: string, position?: string, product?: string) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'my account',
            'component.LabelEvent': 'account balance',
            'component.ActionEvent': action,
            'component.PositionEvent': position || 'not applicable',
            'component.LocationEvent': 'my balance page',
            'component.EventDetails': details,
            'component.URLClicked': 'not applicable',
            'component.Product': product || 'not applicable',
        });
    }
}
