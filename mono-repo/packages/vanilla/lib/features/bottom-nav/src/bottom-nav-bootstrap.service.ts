import { Injectable } from '@angular/core';

import { BottomNavService as CoreBottomNavService, DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';
import { SpeculationService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { BottomNavConfig } from './bottom-nav.client-config';
import { BottomNavComponent } from './bottom-nav.component';
import { BottomNavService } from './bottom-nav.service';

@Injectable()
export class BottomNavBootstrapService implements OnFeatureInit {
    constructor(
        private config: BottomNavConfig,
        private dynamicLayoutService: DynamicLayoutService,
        private coreBottomNavService: CoreBottomNavService,
        private bottomNavService: BottomNavService,
        private speculationService: SpeculationService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.coreBottomNavService.set(this.bottomNavService);
        this.dynamicLayoutService.addComponent(SlotName.App, BottomNavComponent, null);
        this.bottomNavService.initProductHighlighting();

        if (!this.bottomNavService.currentHighlightedProductName) {
            this.bottomNavService.setHighlightedProduct();
        }

        this.speculationService.whenReady.subscribe(() => this.speculationService.prerender(this.config.items.map((item) => item.url)));
    }
}
