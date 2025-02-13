import { Injectable, inject } from '@angular/core';

import { DslService, NetworkService, OnFeatureInit } from '@frontend/vanilla/core';
import { filter, first } from 'rxjs/operators';

import { OfflineConfig } from './offline.client-config';
import { OfflineService } from './offline.service';

@Injectable()
export class OfflineBootstrapService implements OnFeatureInit {
    private networkService = inject(NetworkService);
    private offlineService = inject(OfflineService);
    private offlineConfig = inject(OfflineConfig);
    private dslService = inject(DslService);

    onFeatureInit() {
        this.offlineConfig.whenReady.subscribe(() => {
            this.dslService
                .evaluateExpression<boolean>(this.offlineConfig.isOverlayEnabled)
                .pipe(first())
                .subscribe((isEnabled) => {
                    if (isEnabled) {
                        this.networkService.events.pipe(filter((e) => !e.online)).subscribe(() => this.offlineService.showOverlay());
                    }
                });
        });
    }
}
