import { Injectable, inject } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class ProductSwitchCoolOffTrackingService {
    private trackingService = inject(TrackingService);

    trackLoad(destinationProduct: string, sourceProduct: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'Product Switch',
            'component.LabelEvent': 'RG Interceptor',
            'component.ActionEvent': 'Load',
            'component.PositionEvent': destinationProduct,
            'component.LocationEvent': sourceProduct,
            'component.EventDetails': 'RG Product Switch Interceptor',
            'component.URLClicked': 'not applicable',
        });
    }

    trackConfirm(destinationProduct: string, sourceProduct: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'Product Switch',
            'component.LabelEvent': 'RG Interceptor',
            'component.ActionEvent': 'Click',
            'component.PositionEvent': destinationProduct,
            'component.LocationEvent': sourceProduct,
            'component.EventDetails': 'Got It',
            'component.URLClicked': 'not applicable',
        });
    }
}
