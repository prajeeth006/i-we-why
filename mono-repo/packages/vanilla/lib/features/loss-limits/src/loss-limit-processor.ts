import { Injectable } from '@angular/core';

import { EventContext, EventProcessor, EventType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { LossLimitsOverlayService } from './loss-limits-overlay.service';
import { LossLimitsConfig } from './loss-limits.client-config';
import { LossLimitsDetails, LossLimitsEvent } from './loss-limits.models';

@Injectable()
export class LossLimitsProcessor implements EventProcessor {
    constructor(
        private lossLimitsConfig: LossLimitsConfig,
        private lossLimitsOverlayService: LossLimitsOverlayService,
    ) {}

    async process(event: EventContext<LossLimitsEvent>) {
        if (event.type !== EventType.Rtms || !event.data) {
            return;
        }

        await firstValueFrom(this.lossLimitsConfig.whenReady);

        const limitNotifications: LossLimitsDetails[] = [];

        for (const notificationType in event.data) {
            const amounts = event.data[notificationType];

            if (amounts) {
                limitNotifications.push({
                    ...amounts,
                    notificationType,
                    usedPercentage: (amounts.totalLossAmount / amounts.playerLimitAmount) * 100,
                });
            }
        }

        if (limitNotifications.find((notification: LossLimitsDetails) => notification.isMandatory)) {
            this.lossLimitsOverlayService.show(limitNotifications);
        }
    }
}
