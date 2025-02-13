import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { ProductSwitchCoolOffBootstrapService } from './product-switch-cool-off-bootstrap.service';
import { ProductSwitchCoolOffOverlayService } from './product-switch-cool-off-overlay.service';
import { ProductSwitchCoolOffTrackingService } from './product-switch-cool-off-tracking.service';
import { ProductSwitchCoolOffConfig, productSwitchConfigFactory } from './product-switch-cool-off.client-config';
import { ProductSwitchCoolOffService } from './product-switch-cool-off.service';

export function provide() {
    return [
        ProductSwitchCoolOffService,
        ProductSwitchCoolOffOverlayService,
        ProductSwitchCoolOffTrackingService,
        { provide: ProductSwitchCoolOffConfig, useFactory: productSwitchConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(ProductSwitchCoolOffBootstrapService),
    ];
}
