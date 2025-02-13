import { Mock, Stub } from 'moxxi';

import { DepositLimitExceededService } from '../src/deposit-limit-exceeded.service';

@Mock({ of: DepositLimitExceededService })
export class DepositLimitExceededServiceMock {
    @Stub() showOverlay: jasmine.Spy;
}
