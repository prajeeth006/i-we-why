import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import {
    AverageDeposit,
    CoralCashback,
    LossLimit,
    LoyaltyCashback,
    MLifeProfile,
    NetDeposit,
    PokerCashback,
    ProfitLoss,
    SessionSummary,
    SessionSummaryType,
} from './account-menu.models';

@Injectable({ providedIn: 'root' })
export class AccountMenuResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getCashback(): Observable<LoyaltyCashback> {
        return this.api.get('accountmenu/cashback');
    }

    getCoralCashback(): Observable<CoralCashback> {
        return this.api.get('accountmenu/coralcashback');
    }

    getPokerCashback(): Observable<PokerCashback> {
        return this.api.get('accountmenu/pokercashback');
    }

    getMlifeProfile(): Observable<MLifeProfile> {
        return this.api.get('accountmenu/mlifeprofile');
    }

    getProfitLoss(range: number): Observable<ProfitLoss> {
        return this.api.get('accountmenu/profitloss', { range });
    }

    getNetDeposit(level: string, days: number): Observable<NetDeposit> {
        return this.api.get('accountmenu/netdeposit', { level, days });
    }

    getLossLimit(): Observable<LossLimit> {
        return this.api.get('accountmenu/losslimit');
    }

    getTimeSpent(aggregationType: SessionSummaryType): Observable<SessionSummary> {
        return this.api.get('accountmenu/timespent', { aggregationType });
    }

    getAverageDeposit(days: number): Observable<AverageDeposit> {
        return this.api.get('accountmenu/averagedeposit', { days });
    }
}
