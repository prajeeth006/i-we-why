import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SingleSlot, SlotName, SlotType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { NavigationLayoutTopMenuComponent } from './navigation-layout-top-menu.component';
import { NavigationLayoutConfig } from './navigation-layout.client-config';
import { NavigationLayoutService } from './navigation-layout.service';

@Injectable()
export class NavigationLayoutBootstrapService implements OnFeatureInit {
    constructor(
        private config: NavigationLayoutConfig,
        private navigationLayoutService: NavigationLayoutService,
        private dynamicLayoutService: DynamicLayoutService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.navigationLayoutService.init();

        if (this.navigationLayoutService.isV1orV4) {
            const headerSubNavSlot = this.dynamicLayoutService.getSlot<SingleSlot>(SlotName.HeaderSubNav, SlotType.Single);

            if (!headerSubNavSlot.component) {
                this.dynamicLayoutService.setComponent(SlotName.HeaderSubNav, NavigationLayoutTopMenuComponent, null);
            }
        }
    }
}
