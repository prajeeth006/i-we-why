import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { AccountUpgradeConfig } from '../src/account-upgrade.client-config';

@Mock({ of: AccountUpgradeConfig })
export class AccountUpgradeConfigMock extends AccountUpgradeConfig {
    override whenReady = new Subject<void>();
}
