import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { DepositLimitExceededBootstrapService } from './deposit-limit-exceeded-bootstrap.service';
import { DepositLimitExceededConfig, depositLimitExceededConfigFactory } from './deposit-limit-exceeded.client-config';
import { DepositLimitExceededService } from './deposit-limit-exceeded.service';

export function provide() {
    return [
        DepositLimitExceededService,
        {
            provide: DepositLimitExceededConfig,
            useFactory: depositLimitExceededConfigFactory,
            deps: [LazyClientConfigService],
        },
        runOnFeatureInit(DepositLimitExceededBootstrapService),
    ];
}
