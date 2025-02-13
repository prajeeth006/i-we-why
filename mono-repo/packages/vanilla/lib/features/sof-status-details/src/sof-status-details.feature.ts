import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { SofStatusDetailsBootstrapService } from './sof-status-details-bootstrap.service';
import { SofStatusDetailsDslValuesProvider } from './sof-status-details-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(SofStatusDetailsBootstrapService), registerLazyDslOnModuleInit(SofStatusDetailsDslValuesProvider)];
}
