import { Injectable } from '@angular/core';

import { Logger, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { LaunchDarklyConfig } from './launch-darkly.client-config';
import { LaunchDarklyService } from './launch-darkly.service';

@Injectable()
export class LaunchDarklyBootstrapService implements OnFeatureInit {
    constructor(
        private launchDarklyService: LaunchDarklyService,
        private config: LaunchDarklyConfig,
        private log: Logger,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        if (this.config.clientId) {
            this.launchDarklyService.initialize(this.config.clientId);
        } else {
            this.log.warnRemote('[LaunchDarkly] - ClientId not configured in Dynacon.');
        }
    }
}
