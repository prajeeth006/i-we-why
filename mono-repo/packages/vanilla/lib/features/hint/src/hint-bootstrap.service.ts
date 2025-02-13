import { Injectable } from '@angular/core';

import { OnFeatureInit, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { HintQueueService } from './hint-queue.service';
import { HitType } from './hint.models';

@Injectable()
export class HintBootstrapService implements OnFeatureInit {
    constructor(
        private hintQueueService: HintQueueService,
        private user: UserService,
    ) {}

    onFeatureInit() {
        if (!this.user.isAuthenticated) {
            this.hintQueueService.add(HitType.HomeScreen);
        }

        this.user.events
            .pipe(filter((event: UserEvent) => event instanceof UserLoginEvent))
            .subscribe(() => this.hintQueueService.add(HitType.HomeScreen));
    }
}
