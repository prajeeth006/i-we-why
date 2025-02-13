import { Mock, StubObservable } from 'moxxi';

import { AccountMenuResourceService } from '../src/account-menu-resource.service';

@Mock({ of: AccountMenuResourceService })
export class AccountMenuResourceServiceMock {
    @StubObservable() getCashback: jasmine.ObservableSpy;
    @StubObservable() getCoralCashback: jasmine.ObservableSpy;
    @StubObservable() getPokerCashback: jasmine.ObservableSpy;
    @StubObservable() getMlifeProfile: jasmine.ObservableSpy;
    @StubObservable() getLossLimit: jasmine.ObservableSpy;
    @StubObservable() getNetDeposit: jasmine.ObservableSpy;
    @StubObservable() getAverageDeposit: jasmine.ObservableSpy;
    @StubObservable() getProfitLoss: jasmine.ObservableSpy;
    @StubObservable() getTimeSpent: jasmine.ObservableSpy;
}
