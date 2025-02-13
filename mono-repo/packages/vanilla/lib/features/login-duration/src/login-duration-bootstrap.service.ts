import { Injectable } from '@angular/core';

import { DynamicLayoutService, EmbeddableComponentsService, OnFeatureInit } from '@frontend/vanilla/core';
import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';
import { firstValueFrom } from 'rxjs';

import { LoginDurationConfig } from './login-duration.client-config';
import { LoginDurationComponent } from './login-duration.component';

@Injectable()
export class LoginDurationBootstrapService implements OnFeatureInit {
    constructor(
        private config: LoginDurationConfig,
        private dynamicLayoutService: DynamicLayoutService,
        private embeddableComponentsService: EmbeddableComponentsService,
        private currentSessionConfig: CurrentSessionConfig,
    ) {}

    async onFeatureInit() {
        await Promise.all([firstValueFrom(this.config.whenReady), firstValueFrom(this.currentSessionConfig.whenReady)]);

        this.embeddableComponentsService.registerEmbeddableComponent(LoginDurationComponent, 100);

        if (this.config.slotName) {
            this.dynamicLayoutService.addComponent(this.config.slotName, LoginDurationComponent, null);
        }
    }
}
