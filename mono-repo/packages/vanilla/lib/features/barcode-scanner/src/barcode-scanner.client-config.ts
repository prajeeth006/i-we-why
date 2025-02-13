import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnBarcodeScanner', product: ClientConfigProductName.SF })
@Injectable()
export class BarcodeScannerConfig extends LazyClientConfigBase {
    conditionalEvents: { key: string; value: string }[];
    overlays: ViewTemplate[];
}

export function barcodeScannerConfigFactory(service: LazyClientConfigService) {
    return service.get(BarcodeScannerConfig);
}
