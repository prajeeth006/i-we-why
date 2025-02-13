import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { PlayerGamingDeclarationBootstrapService } from './player-gaming-declaration-bootstrap.service';
import { PlayerGamingDeclarationTrackingService } from './player-gaming-declaration-tracking.service';
import { PlayerGamingDeclarationConfig, playerGamingDeclarationConfigFactory } from './player-gaming-declaration.client-config';
import { PlayerGamingDeclarationService } from './player-gaming-declaration.service';

export function provide() {
    return [
        PlayerGamingDeclarationService,
        PlayerGamingDeclarationTrackingService,
        { provide: PlayerGamingDeclarationConfig, useFactory: playerGamingDeclarationConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(PlayerGamingDeclarationBootstrapService),
    ];
}
