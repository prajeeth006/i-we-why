import { GenericListItem, MenuContentItem } from '@frontend/vanilla/core';
import { AccountMenuDataService, AccountMenuOnboardingService, AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';
import { Mock, Stub } from 'moxxi';
import { ReplaySubject, Subject } from 'rxjs';

import { AccountMenuOnboardingOverlayService } from '../src/onboarding/account-menu-onboarding-overlay.service';

@Mock({ of: AccountMenuDataService })
export class AccountMenuDataServiceMock {
    hierarchy: any;
    version: number;
    resources: GenericListItem;
    vipLevels: MenuContentItem[];
    routerMode: boolean;
    isDesktop: boolean;
    routerModeReturnUrl?: string;
    content = new ReplaySubject(1);
    topItemsLoaded = new Subject<any[]>();
    menuContentUpdated = new Subject<any[]>();
    widgetUpdate = new Subject<void>();
    @Stub() refreshWidgets: jasmine.Spy;
    @Stub() init: jasmine.Spy;
    @Stub() getItem: jasmine.Spy;
    @Stub() setReturnUrlCookie: jasmine.Spy;
    @Stub() removeReturnUrlCookie: jasmine.Spy;
}

@Mock({ of: AccountMenuOnboardingService })
export class AccountMenuOnboardingServiceMock {
    @Stub() init: jasmine.Spy;
    @Stub() saveTourCompleted: jasmine.Spy;
}

@Mock({ of: AccountMenuOnboardingOverlayService })
export class AccountMenuOnboardingOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}

@Mock({ of: AccountMenuTasksService })
export class AccountMenuTasksServiceMock {
    expanded: boolean;
    totalCount: number;
    totalUrgentCount: number;
    displayItems: Subject<MenuContentItem[]> = new Subject<MenuContentItem[]>();
    @Stub() hide: jasmine.Spy;
    @Stub() isUrgent: jasmine.Spy;
    @Stub() showAllHidden: jasmine.Spy;
    @Stub() update: jasmine.Spy;
}
