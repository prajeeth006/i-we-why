import { Injectable } from '@angular/core';

import { AuthService, OnFeatureInit, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { OfflinePageConfig } from './offline-page.client-config';

@Injectable()
export class OfflinePageBootstrapService implements OnFeatureInit {
    constructor(
        private config: OfflinePageConfig,
        private webWorkerService: WebWorkerService,
        private authService: AuthService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.webWorkerService.createWorker(
            WorkerType.OfflinePagePollInterval,
            { interval: this.config.pollInterval },
            async () => await this.authService.isAuthenticated(),
        );
    }
}
