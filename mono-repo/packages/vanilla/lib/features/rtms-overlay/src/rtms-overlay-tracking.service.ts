import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

export interface RtmsTrackingData {
    positionEvent: any;
    locationEvent: string;
    eventDetails: string;
    campaignId: string;
    sitecoreTemplateid: string;
    product: string;
    promoIntent: string;
    labelEvent: string;
    urlClicked: string;
}

@Injectable({ providedIn: 'root' })
export class RtmsOverlayTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackRtmsOverlayToasterLoad(rtmsTrackingData: RtmsTrackingData) {
        this.trackingService.triggerEvent('contentView', this.trackData(rtmsTrackingData, 'load'));
    }

    async trackRtmsOverlayToasterClick(rtmsTrackingData: RtmsTrackingData) {
        await this.trackingService.triggerEvent('Event.Tracking', this.trackData(rtmsTrackingData, 'click'));
    }

    trackRtmsOverlayToasterClose(rtmsTrackingData: RtmsTrackingData) {
        this.trackingService.triggerEvent('Event.Tracking', this.trackData(rtmsTrackingData, 'close'));
    }

    private trackData(rtmsTrackingData: RtmsTrackingData, action: string): any {
        return {
            'component.CategoryEvent': 'customer communications',
            'component.ActionEvent': action,
            'component.LabelEvent': rtmsTrackingData.labelEvent.toLocaleLowerCase(),
            'component.PositionEvent': rtmsTrackingData.positionEvent.toLocaleLowerCase(),
            'component.LocationEvent': rtmsTrackingData.locationEvent,
            'component.EventDetails': action === 'close' ? 'close x' : rtmsTrackingData.eventDetails,
            'component.URLClicked':
                action != 'click' || rtmsTrackingData.urlClicked == 'javascript:void(0)' ? 'not applicable' : rtmsTrackingData.urlClicked,
            'component.ContentPosition': 'not applicable',
            'campaignId': rtmsTrackingData.campaignId,
            'page.sitecoretemplateid': rtmsTrackingData.sitecoreTemplateid,
            'component.Product': rtmsTrackingData.product.toLocaleLowerCase(),
            'component.PromoIntent': rtmsTrackingData.promoIntent,
        };
    }
}
