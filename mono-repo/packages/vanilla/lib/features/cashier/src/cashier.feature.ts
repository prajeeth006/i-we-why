import { runOnFeatureInit } from '@frontend/vanilla/core';

import { CashierBootstrapService } from './cashier-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(CashierBootstrapService)];
}
