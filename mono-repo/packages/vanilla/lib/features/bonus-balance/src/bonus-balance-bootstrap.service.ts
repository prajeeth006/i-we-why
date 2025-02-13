import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { BonusBalanceService } from './bonus-balance.service';

@Injectable()
export class BonusBalanceBootstrapService implements OnFeatureInit {
    constructor(private bonusBalanceService: BonusBalanceService) {}

    onFeatureInit() {
        this.bonusBalanceService.refresh();
    }
}
