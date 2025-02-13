import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { AppInfoConfig, RtmsType } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import {
    NotificationMessageWithType,
    RtmsCommonService,
    RtmsLayerConfig,
    RtmsLayerNotificationQueue,
    RtmsMessageEx,
} from '@frontend/vanilla/shared/rtms';
import { filter } from 'rxjs/operators';

import { RtmsOverlayContainerComponent } from './components/overlays/rtms-overlay-container.component';
import { RtmsToasterOverlayComponent } from './components/toasters/rtms-toaster-container-overlay.component';
import { RtmsOverlayTrackingService } from './rtms-overlay-tracking.service';

@Injectable()
export class RtmsOverlayService {
    currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
        private config: RtmsLayerConfig,
        private rtmsCommonService: RtmsCommonService,
        private rtmsNotificationQueue: RtmsLayerNotificationQueue,
        private rtmsOverlayTrackingService: RtmsOverlayTrackingService,
        private appInfo: AppInfoConfig,
    ) {}

    init() {
        this.rtmsNotificationQueue.newMsObserver.subscribe((x: RtmsMessageEx | null) => {
            if (this.currentRef && (x?.type === RtmsType.OVERLAY || (x?.type === RtmsType.TOASTER && !this.config.enableToastStacking))) {
                return;
            }
            this.rtmsCommonService.processMessage();
        });

        this.initToasters();
        this.initOverlays();
    }
    private trackingDataForService(message: NotificationMessageWithType, rtmsType: string): any {
        return {
            campaignId: message.notification.campaignId,
            eventDetails: message.notification.content.overlayTitle,
            locationEvent: message.notification.content.overlayTitle,
            positionEvent: message.notification.messageType,
            product: this.appInfo.product,
            sitecoreTemplateid: message.notification.sitecoreId,
            urlClicked: 'not applicable',
            labelEvent: rtmsType,
            promoIntent: 'not applicable',
        };
    }
    private initToasters() {
        this.rtmsCommonService.messageProcessedEvents
            .pipe(filter((x: NotificationMessageWithType) => x.type === RtmsType.TOASTER))
            .subscribe((message: NotificationMessageWithType) => {
                this.rtmsCommonService.toasterList.unshift(message.notification);
                this.showToaster();
                this.rtmsOverlayTrackingService.trackRtmsOverlayToasterLoad(this.trackingDataForService(message, RtmsType.TOASTER));
            });
    }
    private initOverlays() {
        this.rtmsCommonService.messageProcessedEvents
            .pipe(filter((x: NotificationMessageWithType) => x.type === RtmsType.OVERLAY))
            .subscribe((message: NotificationMessageWithType) => {
                this.showOverlay();
                this.rtmsOverlayTrackingService.trackRtmsOverlayToasterLoad(this.trackingDataForService(message, RtmsType.OVERLAY));
            });
    }

    private showToaster() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: false,
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
            this.rtmsCommonService.nextMessage();
            const message = this.rtmsCommonService.currentNotificationMessage;
            const messsageWithNotification = new NotificationMessageWithType();
            messsageWithNotification.notification = message;
            this.rtmsOverlayTrackingService.trackRtmsOverlayToasterClose(this.trackingDataForService(messsageWithNotification, RtmsType.TOASTER));
        });

        const portal = new ComponentPortal(
            RtmsToasterOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }

    private showOverlay() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-rtms-overlay-panel', 'generic-modal-overlay'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
            this.rtmsCommonService.nextMessage();
            const message = this.rtmsCommonService.currentNotificationMessage;
            const messsageWithNotification = new NotificationMessageWithType();
            messsageWithNotification.notification = message;
            this.rtmsOverlayTrackingService.trackRtmsOverlayToasterClose(this.trackingDataForService(messsageWithNotification, RtmsType.OVERLAY));
        });

        const portal = new ComponentPortal(
            RtmsOverlayContainerComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
