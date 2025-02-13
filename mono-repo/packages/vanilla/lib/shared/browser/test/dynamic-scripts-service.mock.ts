import { Mock, StubPromise } from 'moxxi';

import { DynamicScriptsService } from '../../../core/src/core';

@Mock({ of: DynamicScriptsService })
export class DynamicScriptsServiceMock {
    @StubPromise() load: jasmine.PromiseSpy;
}
