import { Injectable, inject } from '@angular/core';

import { TrackingService, WINDOW } from '@frontend/vanilla/core';

@Injectable()
export class RedirectMessageTrackingService {
    readonly #window = inject(WINDOW);

    constructor(private trackingService: TrackingService) {}

    trackDisplay(currentLabel: string, redirectLabel: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'GeoIP - Redirection',
            'component.LabelEvent': 'GeoIP - Popup',
            'component.ActionEvent': 'Pop up - Displayed',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': currentLabel,
            'component.EventDetails': redirectLabel,
            'component.URLClicked': this.#window.location,
        });
    }

    trackRedirect(currentLabel: string, redirectLabel: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'GeoIP - Redirection',
            'component.LabelEvent': 'GeoIP - Popup',
            'component.ActionEvent': 'Continue CTA - Clicked',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': currentLabel,
            'component.EventDetails': redirectLabel,
            'component.URLClicked': this.#window.location,
        });
    }

    trackReturn(currentLabel: string, redirectLabel: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'GeoIP - Redirection',
            'component.LabelEvent': 'GeoIP - Popup',
            'component.ActionEvent': 'Return CTA - Clicked',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': currentLabel,
            'component.EventDetails': redirectLabel,
            'component.URLClicked': this.#window.location,
        });
    }
}
