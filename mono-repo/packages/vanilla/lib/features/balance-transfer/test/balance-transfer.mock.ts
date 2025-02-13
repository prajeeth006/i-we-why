import { Mock, Stub } from 'moxxi';

import { BalanceTransferService } from '../src/balance-transfer.service';

@Mock({ of: BalanceTransferService })
export class BalanceTransferServiceMock {
    @Stub() show: jasmine.Spy;
}
