import { Injectable } from '@angular/core';

import { UserLogoutEvent, UserService, UserSessionExpiredEvent } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SelfExclusionConfig } from './self-exclusion.client-config';
import { SelfExclusionService } from './self-exclusion.service';

@Injectable()
export class SelfExclusionBootstrapService {
    constructor(
        private user: UserService,
        private config: SelfExclusionConfig,
        private service: SelfExclusionService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.user.events
            .pipe(filter((e) => e instanceof UserSessionExpiredEvent || e instanceof UserLogoutEvent))
            .subscribe(() => this.service.stopPolling());
    }
}
