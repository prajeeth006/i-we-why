import { Injectable, inject } from '@angular/core';

import { EventContext, EventProcessor, EventType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { DepositSessionOverlayService } from './deposit-session-overlay.service';
import { DepositSessionConfig } from './deposit-session.client-config';
import { DepositSessionEvent } from './deposit-session.models';

@Injectable()
export class DepositSessionProcessor implements EventProcessor {
    private depositSessionConfig = inject(DepositSessionConfig);
    private depositSessionOverlayService = inject(DepositSessionOverlayService);

    async process(event: EventContext<DepositSessionEvent>) {
        if (event.type !== EventType.Native || !event.data) {
            return;
        }

        await firstValueFrom(this.depositSessionConfig.whenReady);

        this.depositSessionOverlayService.show(event.data);
    }
}
