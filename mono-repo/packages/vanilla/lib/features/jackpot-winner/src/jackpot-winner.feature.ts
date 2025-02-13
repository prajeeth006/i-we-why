import { LazyClientConfigService, registerEventProcessor } from '@frontend/vanilla/core';

import { GameJackpotWinnerProcessor } from './game-jackpot-winner-processor';
import { JackpotWinnerConfig, jackpotWinnerConfigFactory } from './jackpot-winner.client-config';

export function provide() {
    return [
        { provide: JackpotWinnerConfig, useFactory: jackpotWinnerConfigFactory, deps: [LazyClientConfigService] },
        registerEventProcessor(GameJackpotWinnerProcessor),
    ];
}
