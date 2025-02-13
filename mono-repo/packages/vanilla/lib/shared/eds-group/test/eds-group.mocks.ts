import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { EdsGroupResourceService } from '../src/eds-group-resource.service';
import { EdsGroupService } from '../src/eds-group.service';

@Mock({ of: EdsGroupResourceService })
export class EdsGroupResourceServiceMock {
    @StubObservable() getGroupOptinStatus: jasmine.ObservableSpy;
    @StubObservable() updateCampaignOptinStatus: jasmine.ObservableSpy;
}

@Mock({ of: EdsGroupService })
export class EdsGroupServiceMock {
    refreshEdsGroupStatus = new Subject<string>();
    freshCampaignDetails = new Subject<string>();
    @Stub() getCampaignStatus: jasmine.Spy;
    @StubPromise() updateCampaignStatus: jasmine.PromiseSpy;
}
