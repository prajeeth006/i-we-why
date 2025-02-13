import { AccountMenuRouter, MenuRoute } from '@frontend/vanilla/shared/account-menu';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

@Mock({ of: AccountMenuRouter })
export class AccountMenuRouterMock {
    currentRoute = new BehaviorSubject<MenuRoute | null>(null);
    routerInitialized = new BehaviorSubject<boolean>(false);

    @Stub() setRoute: jasmine.Spy;
    @Stub() navigateToRoute: jasmine.Spy;
}
