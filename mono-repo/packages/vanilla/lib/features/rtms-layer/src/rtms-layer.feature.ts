import { runOnFeatureInit } from '@frontend/vanilla/core';

import { BonusResourceService } from './bonus-resource.service';
import { RtmsLayerBootstrapService } from './rtms-layer-bootstrap.service';

export function provide() {
    return [BonusResourceService, runOnFeatureInit(RtmsLayerBootstrapService)];
}
