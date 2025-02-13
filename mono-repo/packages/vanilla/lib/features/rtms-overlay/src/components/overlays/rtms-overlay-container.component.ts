import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AppInfoConfig, RtmsType, TrackingService, ViewTemplateForClient } from '@frontend/vanilla/core';
import { NotificationMessage, NotificationMessageHeaderType, RtmsCommonService, RtmsMessageEx } from '@frontend/vanilla/shared/rtms';

import { RtmsOverlayTrackingService } from '../../rtms-overlay-tracking.service';
import { RtmsBonusTeaserComponent } from './rtms-bonus-teaser.component';
import { RtmsCustomOverlayComponent } from './rtms-custom-overlay.component';
import { RtmsOverlayComponent } from './rtms-overlay.component';

@Component({
    standalone: true,
    imports: [RtmsCustomOverlayComponent, RtmsBonusTeaserComponent, RtmsOverlayComponent, CommonModule],
    selector: 'vn-rtms-overlay-container',
    templateUrl: 'rtms-overlay-container.component.html',
    styleUrls: ['../../../../../../../themepark/themes/whitelabel/components/rtms/rtms-layer/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RtmsOverlayContainerComponent implements OnInit {
    currentMessage: RtmsMessageEx | null;
    messageContent: NotificationMessage;
    sitecoreContent: ViewTemplateForClient;
    tacActive: boolean = false;
    HeaderType = NotificationMessageHeaderType;
    constructor(
        private overlayRef: OverlayRef,
        private rtmsCommonService: RtmsCommonService,
        private trackingService: TrackingService,
        private rtmsOverlayTrackingService: RtmsOverlayTrackingService,
        private appInfo: AppInfoConfig,
    ) {}

    ngOnInit() {
        this.currentMessage = this.rtmsCommonService.rtmsMessage;
        this.messageContent = this.rtmsCommonService.currentNotificationMessage;
        this.sitecoreContent = this.rtmsCommonService.rtmsCommonContent;

        if (this.currentMessage) {
            this.trackingService.triggerEvent('Message View', this.currentMessage.eventInfo);
        }
    }

    toggleTaC(expanded: boolean) {
        const eventdetails = expanded ? 't&c - expand' : 't&c - hide';
        this.rtmsOverlayTrackingService.trackRtmsOverlayToasterClick({
            campaignId: this.messageContent.campaignId,
            eventDetails: eventdetails,
            locationEvent: this.messageContent.content.overlayTitle,
            positionEvent: this.messageContent.messageType,
            product: this.appInfo.product,
            sitecoreTemplateid: this.messageContent.sitecoreId,
            urlClicked: 'not applicable',
            labelEvent: RtmsType.OVERLAY,
            promoIntent: 'not applicable',
        });

        this.tacActive = expanded;
    }

    close() {
        if (this.currentMessage) {
            this.trackingService.triggerEvent('A message Close', this.currentMessage.eventInfo);
        }
        this.overlayRef.detach();
        this.rtmsCommonService.nextMessage();
    }
}
