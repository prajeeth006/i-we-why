import { runOnFeatureInit } from '@frontend/vanilla/core';

import { DropDownHeaderBootstrapService } from './dropdown-header-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(DropDownHeaderBootstrapService)];
}
