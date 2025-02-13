import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { ConnectedAccountsService } from '../src/connected-accounts.service';

@Mock({ of: ConnectedAccountsService })
export class ConnectedAccountsServiceMock {
    count = new BehaviorSubject<number | null>(null);
    @Stub() load: jasmine.Spy;
}
