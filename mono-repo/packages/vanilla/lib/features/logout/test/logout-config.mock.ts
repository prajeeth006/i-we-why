import { Mock, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { LogoutResourceService } from '../src/logout-resource.service';
import { LogoutConfig } from '../src/logout.client-config';

@Mock({ of: LogoutConfig })
export class LogoutConfigMock extends LogoutConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: LogoutResourceService })
export class LogoutResourceServiceMock {
    logoutPlaceholders: { [key: string]: string };
    @StubObservable() getCurrentSessionProfitLoss: jasmine.ObservableSpy;
}
