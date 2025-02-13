import { runOnFeatureInit } from '@frontend/vanilla/core';

import { DebounceButtonsBootstrapService } from './debounce-buttons-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(DebounceButtonsBootstrapService)];
}
