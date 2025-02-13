import { registerEventProcessor } from '@frontend/vanilla/core';

import { DepositSessionProcessor } from './deposit-session-processor';

export function provide() {
    return [registerEventProcessor(DepositSessionProcessor)];
}
