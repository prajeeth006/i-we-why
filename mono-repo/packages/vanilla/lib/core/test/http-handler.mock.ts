import { HttpHandler } from '@angular/common/http';

import { Mock, StubObservable } from 'moxxi';

@Mock({ of: HttpHandler })
export class HttpHandlerMock {
    @StubObservable() handle: jasmine.ObservableSpy;
}
