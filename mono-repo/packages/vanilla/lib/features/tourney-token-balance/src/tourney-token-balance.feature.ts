import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { TourneyTokenBalanceBootstrapService } from './tourney-token-balance-bootstrap.service';
import { TourneyTokenBalanceDslValuesProvider } from './tourney-token-balance-dsl-values-provider';
import { TourneyTokenBalanceService } from './tourney-token-balance.service';

export function provide() {
    return [
        TourneyTokenBalanceService,
        runOnFeatureInit(TourneyTokenBalanceBootstrapService),
        registerLazyDslOnModuleInit(TourneyTokenBalanceDslValuesProvider),
    ];
}
