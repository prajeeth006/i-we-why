import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { PlayerActiveWagerBootstrapService } from './player-active-wager-bootstrap.service';
import { PlayerActiveWagerConfig, playerActiveWagerConfigFactory } from './player-active-wager.client-config';

export function provide() {
    return [
        { provide: PlayerActiveWagerConfig, useFactory: playerActiveWagerConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(PlayerActiveWagerBootstrapService),
    ];
}
