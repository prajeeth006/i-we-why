import { registerEventProcessor } from '@frontend/vanilla/core';

import { BalanceRefreshProcessor } from './balance-refresh-processor';

export function provide() {
    return [registerEventProcessor(BalanceRefreshProcessor)];
}
