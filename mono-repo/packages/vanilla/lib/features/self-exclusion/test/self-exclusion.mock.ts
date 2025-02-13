import { Mock, Stub } from 'moxxi';
import { ReplaySubject, Subject } from 'rxjs';

import { SelfExclusionConfig } from '../src/self-exclusion.client-config';
import { SelfExclusionDetails, SelfExclusionService } from '../src/self-exclusion.service';

@Mock({ of: SelfExclusionConfig })
export class SelfExclusionConfigMock extends SelfExclusionConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();
    }
}

@Mock({ of: SelfExclusionService })
export class SelfExclusionServiceMock {
    details = new ReplaySubject<SelfExclusionDetails | null>(1);
    @Stub() init: jasmine.Spy;
    @Stub() stopPolling: jasmine.Spy;
}
