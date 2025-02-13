import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { map } from 'rxjs/operators';

@Injectable()
export class BonusResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    updateBonusTncAcceptance(data: BonusTncAcceptance) {
        return this.api.post('bonus/updatebonustncacceptance', data).pipe(map((data) => data.updated));
    }

    dropBonusOffer(data: DropBonusOffer) {
        return this.api.post('bonus/dropbonusoffer', data).pipe(map((data) => data.dropped));
    }
}

/**
 * @experimental
 */
export interface DropBonusOffer {
    bonusId: string;
    agentName?: string;
    reason?: string;
}

/**
 * @experimental
 */
export interface BonusTncAcceptance {
    offerId: number;
    offerArc: number;
    isCampaignBonus: boolean;
    tncAcceptanceFlag: boolean;
}
