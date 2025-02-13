import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NativeAppService, NativeEventType, ViewTemplateForClient } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, IconCustomComponent],
    selector: 'lh-inbox-notification-banner',
    templateUrl: 'inbox-notification-banner.html',
})
export class InboxNotificationBannerComponent {
    @Output() onNotificationsTurnedOn: EventEmitter<void> = new EventEmitter<void>();
    @Input() content: ViewTemplateForClient;

    constructor(private nativeAppService: NativeAppService) {}

    turnOnNotifications() {
        this.onNotificationsTurnedOn.next();
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.OSPrimerSelected,
            parameters: {
                displaySettingsPage: 'Yes',
            },
        });
    }

    close() {
        this.onNotificationsTurnedOn.next();
    }
}
