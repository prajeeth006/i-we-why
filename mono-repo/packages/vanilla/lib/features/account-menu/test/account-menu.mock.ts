import { GenericListItem, AccountMenuService as PublicAccountMenuService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { CoralCashback, LoyaltyCashback, PokerCashback } from '../src/account-menu.models';
import { AccountMenuService } from '../src/account-menu.service';

@Mock({ of: AccountMenuService })
export class AccountMenuServiceMock {
    hierarchy: any;
    version: number;
    resources: GenericListItem;
    visible = new BehaviorSubject<boolean>(false);
    routerMode: boolean;
    routerModeReturnUrl?: string;
    coralCashbackEvents = new BehaviorSubject<CoralCashback | null>(null);
    pokerCashbackEvents = new BehaviorSubject<PokerCashback | null>(null);
    loyaltyCashbackEvents = new BehaviorSubject<LoyaltyCashback | null>(null);
    @Stub() toggle: jasmine.Spy;
    @Stub() setAccountMenuComponent: jasmine.Spy;
    @Stub() setActiveItem: jasmine.Spy;
    @Stub() getAccountMenuComponent: jasmine.Spy;
    @Stub() setReturnUrlCookie: jasmine.Spy;
    @Stub() removeReturnUrlCookie: jasmine.Spy;
    @StubObservable() updatePokerCashback: jasmine.ObservableSpy;
    @StubObservable() updateLoyaltyCashback: jasmine.ObservableSpy;
    @StubObservable() updateCoralCashback: jasmine.ObservableSpy;
    @StubObservable() updateMLifeProfile: jasmine.ObservableSpy;
}

@Mock({ of: PublicAccountMenuService })
export class PublicAccountMenuServiceMock extends AccountMenuServiceMock {
    whenReady: Subject<void> = new Subject();
}
