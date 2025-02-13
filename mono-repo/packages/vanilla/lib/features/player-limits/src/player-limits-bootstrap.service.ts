import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { PlayerLimitsService } from '@frontend/vanilla/shared/limits';
import { LoginService } from '@frontend/vanilla/shared/login';

@Injectable()
export class PlayerLimitsBootstrapService implements OnFeatureInit {
    constructor(
        private playerLimitsService: PlayerLimitsService,
        private loginService: LoginService,
    ) {}

    onFeatureInit() {
        this.loginService.runAfterLogin(PlayerLimitsBootstrapService.name, () => this.playerLimitsService.refresh());
    }
}
