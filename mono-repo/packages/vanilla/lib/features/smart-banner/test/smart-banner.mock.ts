import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { SmartBannerResourceService } from '../src/smart-banner-resource.service';
import { SmartBannerData } from '../src/smart-banner.models';

@Mock({ of: SmartBannerResourceService })
export class SmartBannerResourceServiceMock {
    @Stub() close: jasmine.Spy;
    @StubObservable() getAppData: jasmine.ObservableSpy;
    smartBannerData = new Subject<SmartBannerData>();
}
