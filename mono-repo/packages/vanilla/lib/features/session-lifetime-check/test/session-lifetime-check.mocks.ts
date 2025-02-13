import { Mock, Stub } from 'moxxi';

import { SessionLifetimeCheckService } from '../src/session-lifetime-check.service';

@Mock({ of: SessionLifetimeCheckService })
export class SessionLifetimeCheckServiceMock {
    @Stub() checkIsSessionActive: jasmine.Spy;
}
