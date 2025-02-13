import { Injectable, inject } from '@angular/core';

import { DynamicLayoutService, EmbeddableComponentsService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { ClockConfig } from './clock.client-config';
import { ClockComponent } from './clock.component';

@Injectable()
export class ClockBootstrapService implements OnFeatureInit {
    private config = inject(ClockConfig);
    private dynamicLayoutService = inject(DynamicLayoutService);
    private embeddableComponentsService = inject(EmbeddableComponentsService);

    async onFeatureInit() {
        this.embeddableComponentsService.registerEmbeddableComponent(ClockComponent);

        await firstValueFrom(this.config.whenReady);

        if (this.config.slotName) {
            this.dynamicLayoutService.addFirstComponent(this.config.slotName, ClockComponent, {
                slotName: this.config.slotName,
                format: this.config.dateTimeFormat,
            });
        }
    }
}
