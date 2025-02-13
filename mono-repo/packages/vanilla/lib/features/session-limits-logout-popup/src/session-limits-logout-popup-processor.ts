import { Injectable } from '@angular/core';

import { EventContext, EventProcessor, EventType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { SessionLimitsLogoutPopupConfig } from './session-limits-logout-popup.client-config';
import { SessionLimitLogoutEvent } from './session-limits-logout-popup.models';
import { SessionLimitsLogoutPopupService } from './session-limits-logout-popup.service';

@Injectable()
export class SessionLimitsLogoutPopupProcessor implements EventProcessor {
    constructor(
        private config: SessionLimitsLogoutPopupConfig,
        private sessionLimitsOverlayService: SessionLimitsLogoutPopupService,
    ) {}

    async process(event: EventContext<SessionLimitLogoutEvent>) {
        if (event.type !== EventType.Rtms) {
            return;
        }

        await firstValueFrom(this.config.whenReady);

        this.sessionLimitsOverlayService.show(event.data?.currentLimit);
    }
}
