import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';

import { MenuContentItem, TrackingService, UserService } from '@frontend/vanilla/core';
import { InboxConfig } from '@frontend/vanilla/features/inbox';
import { AccountMenuComponent, AccountMenuDataService, AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';
import { first, firstValueFrom } from 'rxjs';

import { NavigationLayoutPageComponent } from '../navigation-layout-page.component';
import { CommonActionsCardComponent } from './common-actions-card.compontent';
import { HelpCardComponent } from './help-card.component';
import { InboxCardComponent } from './inbox-card.component';
import { ProfilePageNudgesComponent } from './profile-page-nudges.component';

/**
 * @whatItDoes Displays the profile page a.k.a. Customer Hub page.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        AccountMenuComponent,
        CommonActionsCardComponent,
        HelpCardComponent,
        InboxCardComponent,
        ProfilePageNudgesComponent,
        NavigationLayoutPageComponent,
    ],
    selector: 'vn-profile-page',
    templateUrl: 'profile-page.html',
})
export class ProfilePageComponent implements OnInit {
    readonly profilePageItemsPosition = signal<{ [key: string]: number }>(this.accountMenuDataService.profilePageItemsPosition);
    readonly profilePageItemsPositionCount = computed(() => Object.keys(this.profilePageItemsPosition()).length);
    accountMenuRoutesAvailable: boolean;

    constructor(
        public accountMenuDataService: AccountMenuDataService,
        public user: UserService,
        public inboxConfig: InboxConfig,
        private accountMenuTasksService: AccountMenuTasksService,
        private trackingService: TrackingService,
    ) {}

    get content(): MenuContentItem | null {
        return this.accountMenuDataService.getItem('profile');
    }

    get commonActions(): MenuContentItem | null {
        return this.accountMenuDataService.getItem('commonactions');
    }

    get inbox(): MenuContentItem | null {
        return this.accountMenuDataService.getItem('inboxcard');
    }

    get help(): MenuContentItem | null {
        return this.accountMenuDataService.getItem('helpcard');
    }

    async ngOnInit() {
        await firstValueFrom(this.inboxConfig.whenReady);

        this.accountMenuDataService.content.pipe(first()).subscribe(() => {
            this.accountMenuRoutesAvailable = true;
        });
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': `pending tasks ${this.accountMenuTasksService.totalCount} - urgent tasks ${this.accountMenuTasksService.totalUrgentCount}`,
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': 'my hub page',
            'component.URLClicked': 'not applicable',
        });
    }
}
