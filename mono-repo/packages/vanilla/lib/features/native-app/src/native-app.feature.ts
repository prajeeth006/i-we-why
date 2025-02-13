import { runOnFeatureInit } from '@frontend/vanilla/core';

import { NativeAppBootstrapService } from './native-app-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(NativeAppBootstrapService)];
}
