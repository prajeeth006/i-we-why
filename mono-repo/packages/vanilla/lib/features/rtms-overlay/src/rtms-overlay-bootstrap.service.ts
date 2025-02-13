import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { RtmsLayerConfig, RtmsSubscriberService } from '@frontend/vanilla/shared/rtms';

import { RtmsOverlayService } from './rtms-overlay.service';

@Injectable()
export class RtmsOverlayBootstrapService implements OnFeatureInit {
    constructor(
        private rtmsClientConfig: RtmsLayerConfig,
        private rtmsSubscriberService: RtmsSubscriberService,
        private rtmsToasterOverlayService: RtmsOverlayService,
    ) {}

    onFeatureInit(): void {
        this.rtmsClientConfig.whenReady.subscribe(() => {
            if (this.rtmsClientConfig.version === 2) {
                this.rtmsSubscriberService.init();
                this.rtmsToasterOverlayService.init();
            }
        });
    }
}
