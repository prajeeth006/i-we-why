import { runOnFeatureInit } from '@frontend/vanilla/core';

import { TopMessagesBootstrapService } from './top-messages-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(TopMessagesBootstrapService)];
}
