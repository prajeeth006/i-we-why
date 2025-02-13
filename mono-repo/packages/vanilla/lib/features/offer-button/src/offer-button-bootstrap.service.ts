import { Injectable } from '@angular/core';

import { EmbeddableComponentsService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { OfferBehaviorButtonComponent } from './offer-behavior-button.component';
import { OfferButtonConfig } from './offer-button.client-config';

@Injectable()
export class OfferButtonBootstrapService implements OnFeatureInit {
    constructor(
        private embeddableComponentsService: EmbeddableComponentsService,
        private config: OfferButtonConfig,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.embeddableComponentsService.registerEmbeddableComponent(OfferBehaviorButtonComponent, 23);
    }
}
