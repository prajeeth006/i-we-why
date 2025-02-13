import { HttpClient } from '@angular/common/http';

import { Mock, StubObservable } from 'moxxi';

@Mock({ of: HttpClient })
export class HttpClientMock {
    @StubObservable() request: jasmine.ObservableSpy;
    @StubObservable() get: jasmine.ObservableSpy;
    @StubObservable() post: jasmine.ObservableSpy;
    @StubObservable() put: jasmine.ObservableSpy;
    @StubObservable() delete: jasmine.ObservableSpy;
}
