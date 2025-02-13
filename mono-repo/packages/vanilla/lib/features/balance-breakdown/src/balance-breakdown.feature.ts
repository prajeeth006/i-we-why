import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { BalanceBreakdownBootstrapService } from './balance-breakdown-bootstrap.service';
import { BalanceBreakdownContent, balanceBreakdownConfigFactory } from './balance-breakdown.client-config';

export function provide() {
    return [
        { provide: BalanceBreakdownContent, deps: [LazyClientConfigService], useFactory: balanceBreakdownConfigFactory },
        runOnFeatureInit(BalanceBreakdownBootstrapService),
    ];
}
