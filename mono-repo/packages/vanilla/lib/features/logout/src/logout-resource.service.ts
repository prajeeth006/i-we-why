import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

export class ProfitLoss {
    constructor(
        public readonly totalReturn: number,
        public readonly totalStake: number,
    ) {}
}

@Injectable()
export class LogoutResourceService {
    logoutPlaceholders: { [key: string]: string };
    constructor(private api: SharedFeaturesApiService) {}

    getCurrentSessionProfitLoss(): Observable<ProfitLoss> {
        return this.api.get('accountmenu/currentsessionprofitloss');
    }
}
