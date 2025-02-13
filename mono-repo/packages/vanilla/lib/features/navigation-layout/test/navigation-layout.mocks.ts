import { MenuContentItem } from '@frontend/vanilla/core';
import { NavigationLayoutScrollService } from '@frontend/vanilla/features/navigation-layout';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { NavigationItem } from '../src/models';
import { NavigationLayoutService } from '../src/navigation-layout.service';
import { ProfilePageNudgesService } from '../src/profile-page/profile-page-nudges.service';

@Mock({ of: NavigationLayoutService })
export class NavigationLayoutServiceMock {
    @Stub() init: jasmine.Spy;
    @Stub() getItem: jasmine.Spy;
    showTopMenu: BehaviorSubject<NavigationItem> = new BehaviorSubject<NavigationItem>(<any>null);
    initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    headerEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isV1orV4: boolean;
}

@Mock({ of: NavigationLayoutScrollService })
export class NavigationLayoutScrollServiceMock {
    @Stub() scrollEvents: jasmine.ObservableSpy;
    @Stub() sendScrollEvent: jasmine.Spy;
}

@Mock({ of: ProfilePageNudgesService })
export class ProfilePageNudgesServiceMock {
    displayItems: Subject<MenuContentItem[]> = new BehaviorSubject<MenuContentItem[]>([]);
    @Stub() hide: jasmine.Spy;
}
