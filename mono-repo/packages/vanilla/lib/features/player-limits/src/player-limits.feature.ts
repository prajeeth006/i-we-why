import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { PlayerLimitsBootstrapService } from './player-limits-bootstrap.service';
import { PlayerLimitsDslValuesProvider } from './player-limits-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(PlayerLimitsDslValuesProvider), runOnFeatureInit(PlayerLimitsBootstrapService)];
}
