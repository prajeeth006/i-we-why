import { runOnFeatureInit } from '@frontend/vanilla/core';

import { BalanceTransferBootstrapService } from './balance-transfer-bootstrap.service';
import { BalanceTransferService } from './balance-transfer.service';

export function provide() {
    return [BalanceTransferService, runOnFeatureInit(BalanceTransferBootstrapService)];
}
