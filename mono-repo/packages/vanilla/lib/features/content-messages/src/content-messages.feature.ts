import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ContentMessagesBootstrapService } from './content-messages-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(ContentMessagesBootstrapService)];
}
