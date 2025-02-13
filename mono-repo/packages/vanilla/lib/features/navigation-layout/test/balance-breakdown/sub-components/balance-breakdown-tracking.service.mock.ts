import { Mock, Stub } from 'moxxi';

import { BalanceBreakdownTrackingService } from '../../../../../features/balance-breakdown/src/balance-breakdown-tracking.service';

@Mock({ of: BalanceBreakdownTrackingService })
export class BalanceBreakdownTrackingServiceMock {
    @Stub() trackExpandBalance: jasmine.Spy;
    @Stub() trackProductLoad: jasmine.Spy;
    @Stub() trackInfoClick: jasmine.Spy;
    @Stub() trackTutorialNavigation: jasmine.Spy;
    @Stub() trackBalanceItemLoad: jasmine.Spy;
}
