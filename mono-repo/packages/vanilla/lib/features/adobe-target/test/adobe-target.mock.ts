import { Mock, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { AdobeTargetBackendService } from '../src/adobe-target-backend.service';
import { AdobeTargetConfig } from '../src/adobe-target.client-config';

@Mock({ of: AdobeTargetBackendService })
export class AdobeTargetBaseServiceMock {
    @StubObservable() getOffer: jasmine.ObservableSpy;
}

@Mock({ of: AdobeTargetConfig })
export class AdobeTargetConfigMock extends AdobeTargetConfig {
    override whenReady = new Subject<void>();
}
