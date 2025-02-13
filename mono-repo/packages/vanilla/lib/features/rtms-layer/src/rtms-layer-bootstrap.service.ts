import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';
import { RtmsLayerConfig, RtmsSubscriberService } from '@frontend/vanilla/shared/rtms';

import { RtmsLayerComponent } from './components/rtms-layer.component';

@Injectable()
export class RtmsLayerBootstrapService implements OnFeatureInit {
    constructor(
        private rtmsSubscriberService: RtmsSubscriberService,
        private rtmsClientConfig: RtmsLayerConfig,
        private dynamicLayoutService: DynamicLayoutService,
    ) {}

    onFeatureInit(): void {
        this.rtmsClientConfig.whenReady.subscribe(() => {
            if (this.rtmsClientConfig.version === 1) {
                this.rtmsSubscriberService.init();
                this.dynamicLayoutService.addComponent(SlotName.App, RtmsLayerComponent, null);
            }
        });
    }
}
