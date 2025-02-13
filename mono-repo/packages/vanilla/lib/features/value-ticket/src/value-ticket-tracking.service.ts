import { Injectable, inject } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class ValueTicketTrackingService {
    private trackingService = inject(TrackingService);

    trackBlockTicketOverlayDisplay(message?: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'error',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'error message',
            'component.EventDetails': message?.replace(/(<([^>]+)>)/gi, ''),
        });
    }

    trackBlockTicketOverlayClickEvent(message?: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'error',
            'component.PositionEvent': message?.replace(/(<([^>]+)>)/gi, ''),
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'ok',
        });
    }

    trackScanTicketOverlayDisplay() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'value ticket popup',
            'component.EventDetails': 'value ticket popup',
        });
    }

    trackScanTicketOverlayClickEvent(message: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'value ticket popup',
            'component.EventDetails': message?.replace(/(<([^>]+)>)/gi, ''),
        });
    }
}
