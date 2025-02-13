import { runOnFeatureInit } from '@frontend/vanilla/core';

import { OverlayMessagesBootstrapService } from './overlay-messages-bootstrap.service';
import { OverlayMessagesService } from './overlay-messages.service';

export function provide() {
    return [OverlayMessagesService, runOnFeatureInit(OverlayMessagesBootstrapService)];
}
