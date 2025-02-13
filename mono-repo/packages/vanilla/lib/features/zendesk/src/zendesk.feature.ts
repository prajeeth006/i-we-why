import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ZendeskBootstrapService } from './zendesk-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(ZendeskBootstrapService)];
}
