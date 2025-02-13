import { Mock, StubObservable } from 'moxxi';

import { HostApiService } from '../host-api.service';

@Mock({ of: HostApiService })
export class VanillaApiServiceMock {
    @StubObservable() request: jasmine.ObservableSpy;
    @StubObservable() jsonp: jasmine.ObservableSpy;
    @StubObservable() get: jasmine.ObservableSpy;
    @StubObservable() post: jasmine.ObservableSpy;
    @StubObservable() put: jasmine.ObservableSpy;
    @StubObservable() delete: jasmine.ObservableSpy;
}
