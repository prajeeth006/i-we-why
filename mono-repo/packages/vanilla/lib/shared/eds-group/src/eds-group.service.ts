import { Injectable } from '@angular/core';

import { Subject, catchError, debounceTime, firstValueFrom, switchMap } from 'rxjs';

import { CampaignDetails, EdsGroupResourceService } from './eds-group-resource.service';

@Injectable({
    providedIn: 'root',
})
export class EdsGroupService {
    public freshCampaignDetails: Subject<string> = new Subject<string>();
    public refreshEdsGroupStatus: Subject<string> = new Subject<string>();
    private campaignDetails: CampaignDetails[] = [];

    constructor(private edsGroupResourcesService: EdsGroupResourceService) {
        this.refreshEdsGroupStatus
            .pipe(
                debounceTime(200),
                switchMap(async (groupId) => {
                    const groupOptinStatus = await firstValueFrom(
                        this.edsGroupResourcesService.getGroupOptinStatus(groupId).pipe(catchError(() => Promise.resolve({ campaignDetails: [] }))),
                    );
                    return { groupOptinStatus, groupId };
                }),
            )
            .subscribe((result) => {
                this.campaignDetails = result.groupOptinStatus.campaignDetails;
                this.freshCampaignDetails.next(result.groupId);
            });
    }

    async updateCampaignStatus(groupId: string, campaignId: string, optIn: boolean = true): Promise<string> {
        const status = await firstValueFrom(
            this.edsGroupResourcesService.updateCampaignOptinStatus(campaignId, optIn).pipe(catchError(() => Promise.resolve('error'))),
        );
        this.refreshEdsGroupStatus.next(groupId);
        return status;
    }

    getCampaignStatus(campaignId: string): string {
        return this.campaignDetails.find((campaign) => campaign?.id?.toString() === campaignId)?.optInStatus || 'error';
    }
}
