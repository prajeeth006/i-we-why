import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { AccountMenuScrollService } from '../src/account-menu-scroll.service';

@Mock({ of: AccountMenuScrollService })
export class AccountMenuScrollServiceMock {
    scroll: Subject<number> = new Subject();
    onScrollTo: Subject<{ x: number; y: number }> = new Subject();
    @Stub() onScroll: jasmine.Spy;
    @Stub() scrollTo: jasmine.Spy;
}
