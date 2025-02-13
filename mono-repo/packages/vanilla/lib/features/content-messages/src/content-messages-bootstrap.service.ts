import { Injectable } from '@angular/core';

import { EmbeddableComponentsService, OnFeatureInit } from '@frontend/vanilla/core';

import { CloseMessageComponent } from './close-message.component';

@Injectable()
export class ContentMessagesBootstrapService implements OnFeatureInit {
    constructor(private embeddableComponentsService: EmbeddableComponentsService) {}

    onFeatureInit() {
        this.embeddableComponentsService.registerEmbeddableComponent(CloseMessageComponent, 100);
    }
}
