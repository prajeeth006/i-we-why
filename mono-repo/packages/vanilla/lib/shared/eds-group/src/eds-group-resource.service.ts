import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

/**
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class EdsGroupResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getGroupOptinStatus(groupId: string | null): Observable<EdsGroupOptinStatus> {
        return this.api.get(`edsgroup/${groupId}`);
    }

    updateCampaignOptinStatus(campaignId: string, optIn: boolean = true) {
        return this.api.post(`edsgroup/${campaignId}/${optIn}`);
    }
}

export interface EdsGroupOptinStatus {
    campaignDetails: CampaignDetails[];
}

export interface CampaignDetails {
    id: number;
    optInStatus: string;
}
