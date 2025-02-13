import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { BalancePropertiesBootstrapService } from './balance-properties-bootstrap.service';
import { BalancePropertiesDslValuesProvider } from './balance-properties-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(BalancePropertiesBootstrapService), registerLazyDslOnModuleInit(BalancePropertiesDslValuesProvider)];
}
