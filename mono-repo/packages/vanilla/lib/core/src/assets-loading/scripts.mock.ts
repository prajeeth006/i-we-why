import { Mock, Stub, StubPromise } from 'moxxi';

import { ScriptsService } from './scripts.service';

@Mock({ of: ScriptsService })
export class ScriptsServiceMock {
    @Stub() init: jasmine.Spy;
    @StubPromise() load: jasmine.PromiseSpy;
}
