import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';

import { OverlayComponent } from './overlay.component';

@Injectable()
export class OverlayBootstrapService implements OnFeatureInit {
    constructor(private dynamicLayoutService: DynamicLayoutService) {}

    onFeatureInit() {
        this.dynamicLayoutService.addComponent(SlotName.Bottom, OverlayComponent, null);
    }
}
