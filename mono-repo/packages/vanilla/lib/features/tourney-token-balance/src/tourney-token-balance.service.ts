import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TourneyTokenBalance } from './tourney-token-balance.models';

@Injectable()
export class TourneyTokenBalanceService {
    private loaded = false;
    private tourneyTokenBalanceEvents = new BehaviorSubject<TourneyTokenBalance | null>(null);

    get tourneyTokenBalance(): Observable<TourneyTokenBalance | null> {
        return this.tourneyTokenBalanceEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        if (!this.loaded) {
            this.loaded = true;

            this.apiService.get('tourneytokenbalance').subscribe((info: TourneyTokenBalance) => {
                this.tourneyTokenBalanceEvents.next(info);
            });
        }
    }
}
