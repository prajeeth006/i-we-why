import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { RedirectMessageConfig } from './redirect-message.client-config';
import { RedirectMessageService } from './redirect-message.service';

@Injectable()
export class RedirectMessageBootstrapService implements OnFeatureInit {
    constructor(
        private redirectMessageService: RedirectMessageService,
        private config: RedirectMessageConfig,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.redirectMessageService.tryShowMessage();
    }
}
