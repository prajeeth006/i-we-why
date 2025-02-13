import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { TourneyTokenBalance } from '../src/tourney-token-balance.models';
import { TourneyTokenBalanceService } from '../src/tourney-token-balance.service';

@Mock({ of: TourneyTokenBalanceService })
export class TourneyTokenBalanceServiceMock {
    tourneyTokenBalance = new BehaviorSubject<TourneyTokenBalance | null>(null);

    @Stub() load: jasmine.Spy;
}
