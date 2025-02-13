import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';

import { ThirdPartyTrackerComponent } from './third-party-tracker.component';

@Injectable()
export class ThirdPartyTrackerBootstrapService implements OnFeatureInit {
    constructor(private dynamicLayoutService: DynamicLayoutService) {}

    onFeatureInit() {
        this.dynamicLayoutService.addComponent(SlotName.Bottom, ThirdPartyTrackerComponent, null);
    }
}
