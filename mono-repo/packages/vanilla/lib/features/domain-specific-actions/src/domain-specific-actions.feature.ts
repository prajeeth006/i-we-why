import { runOnFeatureInit } from '@frontend/vanilla/core';

import { DomainSpecificActionsBootstrapService } from './domain-specific-actions-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(DomainSpecificActionsBootstrapService)];
}
