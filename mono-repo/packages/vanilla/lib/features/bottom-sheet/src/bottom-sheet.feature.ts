import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { BottomSheetBootstrapService } from './bottom-sheet-bootstrap.service';
import { BottomSheetOverlayService } from './bottom-sheet-overlay.service';
import { BottomSheetConfig, bottomSheetConfigFactory } from './bottom-sheet.client-config';
import { BottomSheetService } from './bottom-sheet.service';

export function provide() {
    return [
        BottomSheetService,
        BottomSheetOverlayService,
        { provide: BottomSheetConfig, useFactory: bottomSheetConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(BottomSheetBootstrapService),
    ];
}
