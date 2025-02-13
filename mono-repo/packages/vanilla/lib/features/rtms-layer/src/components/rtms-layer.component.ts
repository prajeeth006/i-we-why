import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
    RtmsType,
    SwipeDirection,
    SwipeDirective,
    TrackingService,
    UtilsService,
    ViewTemplateForClient,
    WebWorkerService,
} from '@frontend/vanilla/core';
import {
    NotificationMessage,
    NotificationMessageWithType,
    RtmsCommonService,
    RtmsLayerConfig,
    RtmsLayerNotificationQueue,
    RtmsMessageEx,
} from '@frontend/vanilla/shared/rtms';

import { RtmsLayerBonusTeaserComponent } from './rtms-layer-bonus-teaser.component';
import { RtmsLayerCustomOverlayComponent } from './rtms-layer-custom-overlay.component';
import { RtmsLayerOverlayComponent } from './rtms-layer-overlay.component';
import { RtmsLayerToasterComponent } from './rtms-layer-toaster.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RtmsLayerOverlayComponent,
        RtmsLayerCustomOverlayComponent,
        RtmsLayerToasterComponent,
        RtmsLayerBonusTeaserComponent,
        SwipeDirective,
    ],
    selector: 'lh-rtms-layer',
    templateUrl: 'rtms-layer.component.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/rtms/rtms-layer/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RtmsLayerComponent implements OnInit {
    rtmsLayerVisible: boolean;
    currentMessage: RtmsMessageEx | null;
    messageContent: NotificationMessage;
    sitecoreContent: ViewTemplateForClient;
    toasterTheme: string;

    constructor(
        private config: RtmsLayerConfig,
        private rtmsCommonService: RtmsCommonService,
        private rtmsNotificationQueue: RtmsLayerNotificationQueue,
        private trackingService: TrackingService,
        private webWorkerService: WebWorkerService,
        private utilsService: UtilsService,
    ) {}

    ngOnInit() {
        this.toasterTheme = 'dark';

        this.rtmsNotificationQueue.newMsObserver.subscribe(() => {
            if (!this.rtmsLayerVisible) {
                this.rtmsCommonService.processMessage();
            }
        });

        this.rtmsCommonService.messageProcessedEvents.subscribe((message: NotificationMessageWithType) => {
            this.showMessage(message.notification);
        });

        this.rtmsCommonService.errorMessageProcessedEvents.subscribe(() => (this.rtmsLayerVisible = false));
    }

    showMessage(content: NotificationMessage) {
        this.messageContent = content;
        this.currentMessage = this.rtmsCommonService.rtmsMessage;
        this.sitecoreContent = this.rtmsCommonService.rtmsCommonContent;
        this.rtmsLayerVisible = true;

        if (this.rtmsCommonService.rtmsMessage!.type === RtmsType.TOASTER) {
            this.rtmsCommonService.webWorkerId = this.utilsService.generateGuid();

            this.webWorkerService.createWorker(this.rtmsCommonService.webWorkerId, { timeout: this.config.toastShowTime * 1000 }, () => {
                this.closeByTimeout();
                this.webWorkerService.removeWorker(this.rtmsCommonService.webWorkerId);
            });
        }

        this.trackingService.triggerEvent('Message View', this.rtmsCommonService.rtmsMessage?.eventInfo);
    }

    leaveMessageVisible() {
        // clear interval to leave message visible
        this.webWorkerService.removeWorker(this.rtmsCommonService.webWorkerId);
        this.trackingService.triggerEvent('Integration with message', this.rtmsCommonService.rtmsMessage!.eventInfo);
    }

    closeByTimeout() {
        this.close();
        this.trackingService.triggerEvent('Toast message timeout', this.rtmsCommonService.rtmsMessage!.eventInfo);
    }

    closeManually() {
        this.close();
        this.trackingService.triggerEvent('A message Close', this.rtmsCommonService.rtmsMessage!.eventInfo);
    }

    close() {
        this.rtmsLayerVisible = false;
        this.rtmsCommonService.nextMessage();
    }

    onSwipe(direction: SwipeDirection) {
        switch (direction) {
            case SwipeDirection.Left:
            case SwipeDirection.Right: {
                this.closeManually();
                break;
            }
        }
    }
}
