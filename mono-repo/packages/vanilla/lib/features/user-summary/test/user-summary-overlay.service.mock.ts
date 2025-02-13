import { Mock, Stub } from 'moxxi';

import { UserSummaryOverlayService } from '../src/user-summary-overlay.service';

@Mock({ of: UserSummaryOverlayService })
export class UserSummaryOverlayServiceMock {
    @Stub() init: jasmine.Spy;
}
