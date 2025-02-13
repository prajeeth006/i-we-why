import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { UserSummaryConfig } from '../src/user-summary.client-config';

@Mock({ of: UserSummaryConfig })
export class UserSummaryConfigMock extends UserSummaryConfig {
    override whenReady = new Subject<void>();
}
