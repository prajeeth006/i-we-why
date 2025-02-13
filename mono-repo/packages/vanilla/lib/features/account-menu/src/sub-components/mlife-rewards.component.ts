import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { MenuContentItem, UserService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { capitalize } from 'lodash-es';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { MLifeProfile } from '../account-menu.models';

export interface MLifeRewardsProfile {
    userGreeting: string;
    fullNameLower: string;
    tierNumberText: string;
    tierNumber: number;
    tierDescription: string;
    tierItem?: MenuContentItem;
    viewDetailsText: string;
    tierCredits: string;
    fullName: string;
}

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, ImageComponent, IconCustomComponent],
    selector: 'vn-am-mlife-rewards',
    templateUrl: 'mlife-rewards.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/mlife-rewards/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MLifeRewardsComponent extends AccountMenuItemBase implements OnDestroy, OnInit {
    mlife: MLifeRewardsProfile;
    useV2: boolean;
    accountMenuVersion: number;

    private unsubscribe = new Subject<void>();

    constructor(
        private user: UserService,
        private accountMenuConfig: AccountMenuConfig,
    ) {
        super();
    }

    ngOnInit() {
        this.useV2 = this.accountMenuConfig.account?.useLoyaltyBannerV2;
        this.accountMenuVersion = this.accountMenuService.version;
        this.accountMenuService.mLifeProfileEvents
            .pipe(
                filter((d: MLifeProfile | null): d is MLifeProfile => d != null),
                takeUntil(this.unsubscribe),
            )
            .subscribe((data: MLifeProfile) => {
                const resources = this.accountMenuVersion === 1 ? this.accountMenuService.resources.messages : this.item.resources;
                const tierItem = this.item.children.find(
                    (o: MenuContentItem) => o.name.toLowerCase() === `tier_${data.tierDesc.toLowerCase()}${this.useV2 ? '_v2' : ''}`,
                );

                this.mlife = {
                    userGreeting: resources.UserGreeting?.replace('{NAME}', capitalize(this.user.firstName ?? '')) ?? '',
                    fullNameLower: `${this.user.firstName} ${this.user.lastName}`.toLowerCase(),
                    tierNumberText: this.accountMenuVersion === 4 ? resources.MLifeNumberText || '' : '',
                    tierNumber: data.mlifeNo,
                    tierDescription: data.tierDesc,
                    viewDetailsText: this.item.text,
                    tierCredits: resources.MLifeCredits?.replace('{CREDITS}', data.tierCredits.toString()) || '',
                    fullName: `${this.user.firstName} ${this.user.lastName}`,
                };

                if (tierItem) {
                    this.mlife.tierItem = tierItem;
                }
            });
        this.accountMenuService.updateMLifeProfile();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
