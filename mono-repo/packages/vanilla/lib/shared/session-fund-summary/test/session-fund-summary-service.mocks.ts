import { SessionFundSummary } from '@frontend/vanilla/shared/session-fund-summary';
import { Mock, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { SessionFundSummaryService } from '../src/session-fund-summary.service';

@Mock({ of: SessionFundSummaryService })
export class SessionFundSummaryServiceMock {
    getSummary = new Subject<SessionFundSummary>();
    @StubPromise() refresh: jasmine.PromiseSpy;
}
