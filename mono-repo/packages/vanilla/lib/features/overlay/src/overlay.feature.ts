import { runOnFeatureInit } from '@frontend/vanilla/core';

import { OverlayBootstrapService } from './overlay-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(OverlayBootstrapService)];
}
