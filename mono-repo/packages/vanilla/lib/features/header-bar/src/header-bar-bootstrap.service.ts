import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { HeaderBarConfig } from './header-bar.client-config';
import { HeaderBarService } from './header-bar.service';

@Injectable()
export class HeaderBarBootstrapService implements OnFeatureInit {
    constructor(
        private headerBarService: HeaderBarService,
        private config: HeaderBarConfig,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.headerBarService.registerActions();
    }
}
