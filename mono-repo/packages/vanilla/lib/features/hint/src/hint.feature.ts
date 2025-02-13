import { runOnFeatureInit } from '@frontend/vanilla/core';

import { HintBootstrapService } from './hint-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(HintBootstrapService)];
}
