import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { BalanceBreakdownContent } from '../../../../features/balance-breakdown/src/balance-breakdown.client-config';

@Mock({ of: BalanceBreakdownContent })
export class BalanceBreakdownContentMock extends BalanceBreakdownContent {
    override whenReady = new Subject<void>();
    constructor() {
        super();
        this.myBalanceContent = { children: [], resources: {} } as any;
    }
}
