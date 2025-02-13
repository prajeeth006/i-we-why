import { Injectable } from '@angular/core';

import { EventContext, EventProcessor, RtmsType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { JackpotWinnerPopupService } from './jackpot-winner-popup.service';
import { JackpotWinnerConfig } from './jackpot-winner.client-config';
import { JackpotWinnerEvent } from './jackpot-winner.models';

@Injectable()
export class GameJackpotWinnerProcessor implements EventProcessor {
    constructor(
        private jackpotWinnerConfig: JackpotWinnerConfig,
        private service: JackpotWinnerPopupService,
    ) {}

    async process(event: EventContext<JackpotWinnerEvent>) {
        if (event.name === RtmsType.RTMS_GLOBAL_JP_WIN_INFO_EVENT && event.data) {
            await firstValueFrom(this.jackpotWinnerConfig.whenReady);

            this.service.show(event.data);
        }
    }
}
