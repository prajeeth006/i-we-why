import { Mock, StubObservable } from 'moxxi';

import { SharedFeaturesApiService } from '../shared-features-api.service';

@Mock({ of: SharedFeaturesApiService })
export class SharedFeaturesApiServiceMock {
    @StubObservable() request: jasmine.ObservableSpy;
    @StubObservable() jsonp: jasmine.ObservableSpy;
    @StubObservable() get: jasmine.ObservableSpy;
    @StubObservable() post: jasmine.ObservableSpy;
    @StubObservable() put: jasmine.ObservableSpy;
    @StubObservable() delete: jasmine.ObservableSpy;
}
