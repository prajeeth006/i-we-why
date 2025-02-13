import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class CookieConsentTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackLoad() {
        this.trackingService.triggerEvent('Event.Functionality.Generic', { 'page.referringAction': 'Cookie_Consent_Banner_Loaded' });
    }

    trackAccept(navigationsBeforeAccept: string) {
        this.trackingService.triggerEvent('Event.Functionality.Generic', {
            'page.referringAction': `Cookie_Consent_Banner_Accepted_${navigationsBeforeAccept || '1'}`,
        });
    }
}
