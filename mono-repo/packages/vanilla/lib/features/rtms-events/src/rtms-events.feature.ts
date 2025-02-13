import { registerEventProcessor } from '@frontend/vanilla/core';

import { CashierEventsProcessor } from './cashier-events-processor';
import { GameStopProcessor } from './game-stop-proccessor';
import { KycEventsProcessor } from './kyc-events-processor';
import { ToastrEventsProcessor } from './toastr-events-processor';

export function provide() {
    return [
        registerEventProcessor(KycEventsProcessor),
        registerEventProcessor(CashierEventsProcessor),
        registerEventProcessor(GameStopProcessor),
        registerEventProcessor(ToastrEventsProcessor),
    ];
}
