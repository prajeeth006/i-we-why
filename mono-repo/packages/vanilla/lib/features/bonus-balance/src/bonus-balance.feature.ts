import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { BonusBalanceBootstrapService } from './bonus-balance-bootstrap.service';
import { BonusBalanceDslValuesProvider } from './bonus-balance-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(BonusBalanceDslValuesProvider), runOnFeatureInit(BonusBalanceBootstrapService)];
}
