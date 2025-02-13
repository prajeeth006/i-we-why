import { runOnFeatureInit } from '@frontend/vanilla/core';

import { TooltipsBootstrapService } from './tooltips-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(TooltipsBootstrapService)];
}
