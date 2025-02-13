import { BettingStatus, BettingStatusService } from '@frontend/vanilla/shared/betting-status';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: BettingStatusService })
export class BettingStatusServiceMock {
    bettingStatus = new Subject<BettingStatus>();

    @Stub() refresh: jasmine.Spy;
}
