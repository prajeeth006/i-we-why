import { Injectable } from '@angular/core';

import { OnFeatureInit, RtmsMessage, RtmsService, RtmsType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SessionInfoConfig } from './session-info.client-config';
import { SessionInfoService } from './session-info.service';

@Injectable()
export class SessionInfoBootstrapService implements OnFeatureInit {
    constructor(
        private sessionInfoConfig: SessionInfoConfig,
        private rtmsService: RtmsService,
        private sessionInfoService: SessionInfoService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.sessionInfoConfig.whenReady);

        this.rtmsService.messages
            .pipe(filter((message: RtmsMessage) => message.type === RtmsType.RCPU_SESS_EXPIRY_EVENT || message.type === RtmsType.RCPU_ACTION_ACK))
            .subscribe((message: RtmsMessage) => {
                this.sessionInfoService.processMessage(message.type, message.payload);
            });

        await this.sessionInfoService.checkStatus();
    }
}
