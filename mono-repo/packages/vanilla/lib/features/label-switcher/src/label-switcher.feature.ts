import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LabelSwitcherBootstrapService } from './label-switcher-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(LabelSwitcherBootstrapService)];
}
