import { BonusBalance, BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';
import { Mock, Stub } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { BonusBalanceResponse } from '../src/bonus-balance.models';

@Mock({ of: BonusBalanceService })
export class BonusBalanceServiceMock {
    bonusBalance = new ReplaySubject<BonusBalance>(1);
    bonusBalanceV4 = new ReplaySubject<BonusBalanceResponse>(1);
    @Stub() refresh: jasmine.Spy;
}
