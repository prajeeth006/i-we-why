import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { TourneyTokenBalanceService } from './tourney-token-balance.service';

@Injectable()
export class TourneyTokenBalanceBootstrapService implements OnFeatureInit {
    constructor(private tourneyTokenBalanceService: TourneyTokenBalanceService) {}

    onFeatureInit() {
        this.tourneyTokenBalanceService.load();
    }
}
