import { runOnFeatureInit } from '@frontend/vanilla/core';

import { MetaTagsBootstrapService } from './meta-tags-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(MetaTagsBootstrapService)];
}
