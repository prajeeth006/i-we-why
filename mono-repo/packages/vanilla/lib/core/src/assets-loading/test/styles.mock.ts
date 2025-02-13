import { Mock, Stub, StubPromise } from 'moxxi';

import { StylesService } from '../styles.service';

@Mock({ of: StylesService })
export class StylesServiceMock {
    @StubPromise() load: jasmine.PromiseSpy;
    @Stub() init: jasmine.Spy;
    @Stub() addStyle: jasmine.Spy;
    @Stub() removeStyle: jasmine.Spy;
}
