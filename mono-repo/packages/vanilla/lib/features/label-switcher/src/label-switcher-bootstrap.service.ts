import { Injectable } from '@angular/core';

import { Logger, MenuAction, MenuActionsService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { LabelSwitcherConfig } from './label-switcher.client-config';
import { LabelSwitcherService } from './label-switcher.service';

@Injectable()
export class LabelSwitcherBootstrapService implements OnFeatureInit {
    constructor(
        private config: LabelSwitcherConfig,
        private service: LabelSwitcherService,
        private menuActionsService: MenuActionsService,
        private logger: Logger,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.service.init();
        this.menuActionsService.register(MenuAction.SHOW_LABEL_SWITCHER_OVERLAY, async () => {
            const item = this.service.currentGeoLocationItem;
            if (item) {
                await this.service.switchLabel(item);
            } else {
                this.logger.warn(`No content found for current GEO IP region.`);
            }
        });
    }
}
