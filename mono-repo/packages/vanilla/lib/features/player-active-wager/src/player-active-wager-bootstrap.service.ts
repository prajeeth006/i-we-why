import { Injectable } from '@angular/core';

import { OnFeatureInit, RtmsMessage, RtmsService, RtmsType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { PlayerActiveWagerConfig } from './player-active-wager.client-config';
import { PlayerActiveWagerService } from './player-active-wager.service';

@Injectable()
export class PlayerActiveWagerBootstrapService implements OnFeatureInit {
    constructor(
        private rtmsService: RtmsService,
        private playerActiveWagerConfig: PlayerActiveWagerConfig,
        private service: PlayerActiveWagerService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.playerActiveWagerConfig.whenReady);

        this.service.refreshWagerTimer();

        this.rtmsService.messages.subscribe((message: RtmsMessage) => {
            switch (message.type) {
                case RtmsType.LUGAS_SESSION_ACTIVATION_EVENT:
                    this.service.refreshWagerTimer();
                    break;
                case RtmsType.LUGAS_SESSION_DEACTIVATION_EVENT:
                    this.service.setWagerTimer(false);
                    break;
            }
        });
    }
}
