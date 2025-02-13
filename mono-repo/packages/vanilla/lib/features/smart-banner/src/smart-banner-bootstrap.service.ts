import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';
import { finalize } from 'rxjs';

import { SmartBannerResourceService } from './smart-banner-resource.service';
import { SmartBannerComponent } from './smart-banner.component';
import { SmartBannerData } from './smart-banner.models';

@Injectable()
export class SmartBannerBootstrapService implements OnFeatureInit {
    constructor(
        private smartBannerResource: SmartBannerResourceService,
        private dynamicLayoutService: DynamicLayoutService,
    ) {}

    onFeatureInit() {
        this.smartBannerResource.smartBannerData
            .pipe(
                finalize(() => {
                    this.dynamicLayoutService.removeComponent(SlotName.Banner, SmartBannerComponent);
                }),
            )
            .subscribe((smartBanner: SmartBannerData) => {
                this.dynamicLayoutService.setComponent(SlotName.Banner, SmartBannerComponent, { smartBanner });
            });
    }
}
