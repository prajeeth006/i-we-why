import { LazyClientConfigService, registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { DepositLimitsBootstrapService } from './deposit-limits-bootstrap.service';
import { DepositLimitsDslValuesProvider } from './deposit-limits-dsl-values-provider';
import { DepositLimitsConfig, depositLimitsFactory } from './deposit-limits.client-config';

export function provide() {
    return [
        { provide: DepositLimitsConfig, deps: [LazyClientConfigService], useFactory: depositLimitsFactory },
        registerLazyDslOnModuleInit(DepositLimitsDslValuesProvider),
        runOnFeatureInit(DepositLimitsBootstrapService),
    ];
}
