import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { InboxConfig } from '../src/services/inbox.client-config';

@Mock({ of: InboxConfig })
export class InboxConfigMock {
    whenReady = new Subject<void>();

    lazyLoading = {
        pageSize: 10,
        loadBeforeItems: 5,
    };
    useRtms: boolean;
    triggerJumioFromPlayerInbox: boolean;
    jumioKycUrl: string;
    counterPullInterval: number;
    kycVerified: boolean;
}
