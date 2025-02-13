import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { BarcodeScannerBootstrapService } from './barcode-scanner-bootstrap.service';
import { BarcodeScannerErrorOverlayService } from './barcode-scanner-error-overlay.service';
import { BarcodeScannerConfig, barcodeScannerConfigFactory } from './barcode-scanner.client-config';

export function provide() {
    return [
        { provide: BarcodeScannerConfig, useFactory: barcodeScannerConfigFactory, deps: [LazyClientConfigService] },
        BarcodeScannerErrorOverlayService,
        runOnFeatureInit(BarcodeScannerBootstrapService),
    ];
}
