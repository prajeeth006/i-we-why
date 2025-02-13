import { Injectable } from '@angular/core';

import { OnFeatureInit, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { first } from 'rxjs/operators';

import { InactiveConfig } from './inactive.client-config';
import { InactiveService } from './inactive.service';

@Injectable()
export class InactiveBootstrapService implements OnFeatureInit {
    constructor(
        private config: InactiveConfig,
        private user: UserService,
        private service: InactiveService,
    ) {}

    onFeatureInit() {
        this.config.whenReady.subscribe(() => {
            if (this.user.isAuthenticated) {
                this.service.init();
            } else {
                this.user.events.pipe(first((event: UserEvent) => event instanceof UserLoginEvent)).subscribe(() => {
                    this.service.init();
                });
            }
        });
    }
}
