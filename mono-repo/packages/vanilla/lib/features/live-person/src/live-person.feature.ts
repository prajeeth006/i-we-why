import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LivePersonBootstrapService } from './live-person-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(LivePersonBootstrapService)];
}
