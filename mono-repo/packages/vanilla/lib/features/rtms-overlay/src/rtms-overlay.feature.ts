import { runOnFeatureInit } from '@frontend/vanilla/core';

import { BonusResourceService } from './bonus-resource.service';
import { RtmsOverlayBootstrapService } from './rtms-overlay-bootstrap.service';
import { RtmsOverlayService } from './rtms-overlay.service';

export function provide() {
    return [BonusResourceService, RtmsOverlayService, runOnFeatureInit(RtmsOverlayBootstrapService)];
}
