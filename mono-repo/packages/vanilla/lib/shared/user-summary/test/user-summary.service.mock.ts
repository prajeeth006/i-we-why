import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';

import { UserSummaryCookieService } from '../../../features/user-summary/src/user-summary-cookie.service';
import { UserSummaryService } from '../src/user-summary.service';

@Mock({ of: UserSummaryService })
export class UserSummaryServiceMock {
    @StubObservable() getSummary: jasmine.ObservableSpy;
    @StubPromise() refresh: jasmine.PromiseSpy;
}

@Mock({ of: UserSummaryCookieService })
export class UserSummaryCookieServiceMock {
    @Stub() read: jasmine.Spy;
    @Stub() write: jasmine.Spy;
    @Stub() delete: jasmine.Spy;
}
