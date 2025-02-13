import { DepositLimit, DepositLimitsService, LimitsService } from '@frontend/vanilla/shared/limits';
import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { DepositLimitsConfig } from '../../../features/deposit-limits/src/deposit-limits.client-config';

@Mock({ of: DepositLimitsService })
export class DepositLimitsServiceMock {
    limits = new ReplaySubject<DepositLimit[]>(1);
    @Stub() load: jasmine.Spy;
    @StubObservable() get: jasmine.ObservableSpy;
}

@Mock({ of: LimitsService })
export class LimitsServiceMock {
    @StubPromise() getToasterPlaceholders: jasmine.PromiseSpy;
}

@Mock({ of: DepositLimitsConfig })
export class DepositLimitsConfigMock extends DepositLimitsConfig {}
