import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ProductMenuBootstrapService } from './product-menu-bootstrap.service';
import { ProductMenuService } from './product-menu.service';

export function provide() {
    return [ProductMenuService, runOnFeatureInit(ProductMenuBootstrapService)];
}
