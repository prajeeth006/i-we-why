import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { DepositLimitExceededConfig } from '../src/deposit-limit-exceeded.client-config';

@Mock({ of: DepositLimitExceededConfig })
export class DepositLimitExceededConfigMock extends DepositLimitExceededConfig {
    override whenReady = new Subject<void>();
}
