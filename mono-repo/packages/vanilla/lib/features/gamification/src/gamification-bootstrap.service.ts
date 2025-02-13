import { Injectable } from '@angular/core';

import { OnFeatureInit, RtmsService, RtmsType, UserService } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { GamificationService } from './gamification.service';

@Injectable()
export class GamificationBootstrapService implements OnFeatureInit {
    constructor(
        private gamificationService: GamificationService,
        private user: UserService,
        private rtmsService: RtmsService,
    ) {}

    onFeatureInit() {
        if (this.user.isAuthenticated) {
            this.gamificationService.load();

            this.rtmsService.messages.pipe(filter((m) => m.type == RtmsType.COIN_BAL_UPDATE_EVENT)).subscribe(() => {
                this.gamificationService.load();
            });
        }
    }
}
