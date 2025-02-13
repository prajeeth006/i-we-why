import { Inject, Injectable } from '@angular/core';

import {
    MENU_COUNTERS_PROVIDER,
    MenuCountersProvider,
    MenuCountersService,
    OnFeatureInit,
    UserEvent,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { OffersService } from '@frontend/vanilla/shared/offers';
import { filter } from 'rxjs/operators';

import { OffersConfig } from './offers.client-config';

@Injectable()
export class OffersBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private offersService: OffersService,
        private config: OffersConfig,
        private menuCountersService: MenuCountersService,
        @Inject(MENU_COUNTERS_PROVIDER) private offersProviders: MenuCountersProvider[],
    ) {}

    onFeatureInit() {
        this.menuCountersService.registerProviders(this.offersProviders);
        this.config.whenReady.subscribe(() => {
            this.user.events
                .pipe(filter((e: UserEvent) => e instanceof UserLoginEvent))
                .subscribe(() => this.offersService.initPolling(this.config.updateInterval));

            if (this.user.isAuthenticated) {
                this.offersService.initPolling(this.config.updateInterval);
            }
        });
    }
}
