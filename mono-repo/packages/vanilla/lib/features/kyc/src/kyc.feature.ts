import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { KycStatusBootstrapService } from './kyc-status-bootstrap.service';
import { KycStatusDslValuesProvider } from './kyc-status-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(KycStatusBootstrapService), registerLazyDslOnModuleInit(KycStatusDslValuesProvider)];
}
