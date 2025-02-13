import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { GamificationBootstrapService } from './gamification-bootstrap.service';
import { GamificationDslValuesProvider } from './gamification-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(GamificationBootstrapService), registerLazyDslOnModuleInit(GamificationDslValuesProvider)];
}
