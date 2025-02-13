import { Mock, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { LivePersonApiService } from '../src/live-person-api.service';
import { LivePersonConfig } from '../src/live-person.client-config';

@Mock({ of: LivePersonApiService })
export class LivePersonApiServiceMock {
    @StubPromise() triggerEvent: jasmine.Spy;
}

@Mock({ of: LivePersonConfig })
export class LivePersonConfigMock {
    whenReady = new Subject<void>();
    showInvite: boolean;
    accountId: string;
    conditionalEvents: { eventName: string; urlRegex: string; timeoutMilliseconds: number }[];
}
