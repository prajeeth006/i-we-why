import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';

import { AuthService, NativeAppService, NativeEventType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { ActivityPopupCookieService } from './activity-popup-cookie.service';
import { ActivityPopupTrackingService } from './activity-popup-tracking.service';
import { ActivityPopupConfig } from './activity-popup.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, OverlayModule],
    selector: 'vn-activity-popup-overlay',
    templateUrl: 'activity-popup-overlay.html',
})
export class ActivityPopupOverlayComponent implements OnInit {
    private activityPopupConfig = inject(ActivityPopupConfig);
    private overlayRef = inject(OverlayRef);
    private authService = inject(AuthService);
    private nativeAppService = inject(NativeAppService);
    private activityPopupCookieService = inject(ActivityPopupCookieService);
    private trackingService = inject(ActivityPopupTrackingService);

    text = computed(() => this.config().resources.messages.Text?.replace('{MINUTES}', this.loginDurationInMinutes().toString()));
    config = signal<ActivityPopupConfig>(this.activityPopupConfig);
    private loginDurationInMinutes = computed(() => Math.floor(this.config().timeout / 60000));

    ngOnInit() {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SESSION_NOTIFICATION,
            parameters: { timeInMinutes: this.loginDurationInMinutes() },
        });
        this.trackingService.load(this.loginDurationInMinutes());
    }

    continue() {
        this.activityPopupCookieService.write();
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SESSION_NOTIFICATION_CONTINUE,
        });
        this.trackingService.continue(this.loginDurationInMinutes());
        this.overlayRef.detach();
    }

    logout() {
        this.trackingService.logout(this.loginDurationInMinutes());
        this.authService.logout({ redirectAfterLogout: false }).then(() => {
            this.overlayRef.detach();
        });
    }
}
