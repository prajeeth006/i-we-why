import { Injectable, inject } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';
import { firstValueFrom } from 'rxjs';

import { ActivityPopupConfig } from './activity-popup.client-config';
import { ActivityPopupService } from './activity-popup.service';

@Injectable()
export class ActivityPopupBootstrapService implements OnFeatureInit {
    private activityPopupService = inject(ActivityPopupService);
    private config = inject(ActivityPopupConfig);
    private currentSessionConfig = inject(CurrentSessionConfig);

    async onFeatureInit() {
        await Promise.all([firstValueFrom(this.config.whenReady), firstValueFrom(this.currentSessionConfig.whenReady)]);
        this.activityPopupService.setTimer();
    }
}
