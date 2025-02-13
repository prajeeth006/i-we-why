import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { AffordabilityBootstrapService } from './affordability-bootstrap.service';
import { AffordabilityDslValuesProvider } from './affordability-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(AffordabilityBootstrapService), registerLazyDslOnModuleInit(AffordabilityDslValuesProvider)];
}
