import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { PlayBreakBootstrapService } from './play-break-bootstrap.service';
import { PlayBreakDslValuesProvider } from './play-break-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(PlayBreakDslValuesProvider), runOnFeatureInit(PlayBreakBootstrapService)];
}
