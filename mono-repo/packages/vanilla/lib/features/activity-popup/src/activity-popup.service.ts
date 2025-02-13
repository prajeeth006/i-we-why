import { Injectable, inject } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';

import { ActivityPopupCookieService } from './activity-popup-cookie.service';
import { ActivityPopupOverlayService } from './activity-popup-overlay.service';
import { ActivityPopupConfig } from './activity-popup.client-config';

@Injectable()
export class ActivityPopupService {
    private activityPopupOverlayService = inject(ActivityPopupOverlayService);
    private timerService = inject(TimerService);
    private activityPopupConfig = inject(ActivityPopupConfig);
    private activityPopupCookieService = inject(ActivityPopupCookieService);
    private currentSessionConfig = inject(CurrentSessionConfig);

    private timer: NodeJS.Timeout;

    setTimer() {
        this.timerService.clearTimeout(this.timer);

        if (!this.activityPopupCookieService.read()) {
            this.timer = this.timerService.setTimeout(
                () => this.activityPopupOverlayService.show(),
                this.activityPopupConfig.timeout - (this.currentSessionConfig.loginDuration ?? 0),
            );
        }
    }
}
