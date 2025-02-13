import { Injectable } from '@angular/core';

import { UserService, ViewTemplateForClient, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { RtmsLayerContentCacheManagerService } from './resource/rtms-content-cache-manager.service';
import { NotificationMessage, NotificationMessageWithType, RtmsMessageEx } from './rtms-common.models';
import { RtmsLayerConfig } from './rtms-layer.client-config';
import { RtmsLayerNotificationQueue } from './storage/rtms-notification-queue.service';

@Injectable({
    providedIn: 'root',
})
export class RtmsCommonService {
    messageProcessedEvents: Subject<NotificationMessageWithType> = new Subject();
    errorMessageProcessedEvents: Subject<void> = new Subject();

    toasterList: NotificationMessage[] = [];
    fetchingMessageContent: boolean;
    rtmsCommonContent: ViewTemplateForClient;
    rtmsMessage: RtmsMessageEx | null;
    currentNotificationMessage: NotificationMessage;
    webWorkerId: string;

    constructor(
        private config: RtmsLayerConfig,
        private rtmsNotificationQueue: RtmsLayerNotificationQueue,
        private rtmsContentManager: RtmsLayerContentCacheManagerService,
        private user: UserService,
        private webWorkerService: WebWorkerService,
    ) {}

    processMessage() {
        if (this.fetchingMessageContent || !this.user.isAuthenticated || !this.rtmsNotificationQueue.hasMessages()) {
            return;
        }

        this.fetchingMessageContent = true;
        this.rtmsContentManager
            .getMessagesContent(this.rtmsNotificationQueue.dequeue(false)!)
            .pipe(first())
            .subscribe({
                next: (notificationMessage: NotificationMessage) => {
                    this.fetchingMessageContent = false;

                    if (!this.rtmsCommonContent) {
                        this.rtmsCommonContent = this.rtmsContentManager.sitecoreContent;
                    }

                    this.rtmsMessage = this.rtmsNotificationQueue.dequeue(true);
                    this.currentNotificationMessage = notificationMessage;

                    if (!notificationMessage.isErrorMessage) {
                        const notificationWithType = {
                            type: this.rtmsMessage?.type,
                            notification: notificationMessage,
                        } as NotificationMessageWithType;

                        this.messageProcessedEvents.next(notificationWithType);
                    } else {
                        this.errorMessageProcessedEvents.next();
                    }
                },
                error: () => {
                    this.errorMessageProcessedEvents.next();
                    this.fetchingMessageContent = false;
                },
            });
    }

    nextMessage() {
        // clear interval on close message manually
        this.webWorkerService.removeWorker(this.webWorkerId);

        // show next message after configured time
        this.webWorkerService.createWorker(WorkerType.RtmsLayerTimeout, { timeout: this.config.toastShowTime * 1000 }, () => {
            this.processMessage();
            this.webWorkerService.removeWorker(WorkerType.RtmsLayerTimeout);
        });
    }
}
