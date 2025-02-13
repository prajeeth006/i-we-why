import { ClientConfigService } from '@frontend/vanilla/core';
import { Mock, Stub, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { ClientConfigDiff } from '../../src/client-config/client-config.model';

@Mock({ of: ClientConfigService })
export class ClientConfigServiceMock {
    @StubPromise() reload: jasmine.PromiseSpy;
    @StubPromise() reloadOnLogin: jasmine.PromiseSpy;
    @StubPromise() load: jasmine.PromiseSpy;
    @Stub() update: jasmine.Spy;
    @Stub() get: jasmine.Spy;
    updates: Subject<ClientConfigDiff> = new Subject();
}
