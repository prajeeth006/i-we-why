import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { UserFlagsBootstrapService } from './user-flags-bootstrap.service';
import { UserFlagsDslValuesProvider } from './user-flags-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(UserFlagsDslValuesProvider), runOnFeatureInit(UserFlagsBootstrapService)];
}
