import { Injectable } from '@angular/core';

import { BottomSheetService as CoreBottomSheetService, MenuAction, MenuActionsService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { BottomSheetOverlayService } from './bottom-sheet-overlay.service';
import { BottomSheetConfig } from './bottom-sheet.client-config';
import { BottomSheetService } from './bottom-sheet.service';
import { ButtonComponent } from './sub-components/button.component';
import { LinkComponent } from './sub-components/link.component';

@Injectable()
export class BottomSheetBootstrapService implements OnFeatureInit {
    constructor(
        private config: BottomSheetConfig,
        private bottomSheetService: BottomSheetService,
        private coreBottomSheetService: CoreBottomSheetService,
        private bottomSheetOverlayService: BottomSheetOverlayService,
        private menuActionsService: MenuActionsService,
    ) {}

    async onFeatureInit() {
        this.coreBottomSheetService.set(this.bottomSheetService);
        await firstValueFrom(this.config.whenReady);
        this.menuActionsService.register(MenuAction.TOGGLE_BOTTOM_SHEET, () => {
            this.bottomSheetOverlayService.toggle();
        });
        this.bottomSheetService.setBottomSheetComponent('default', LinkComponent);
        this.bottomSheetService.setBottomSheetComponent('button', ButtonComponent);
    }
}
