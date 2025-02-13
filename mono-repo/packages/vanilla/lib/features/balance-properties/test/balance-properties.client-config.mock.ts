import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { BalancePropertiesConfig } from '../src/balance-properties.client-config';

@Mock({ of: BalancePropertiesConfig })
export class BalancePropertiesConfigMock extends BalancePropertiesConfig {
    override whenReady = new Subject<void>();
    override isConfigReady: boolean = true;
}
