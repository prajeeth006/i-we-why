import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { InactiveConfig } from '../src/inactive.client-config';
import { InactiveService } from '../src/inactive.service';

@Mock({ of: InactiveConfig })
export class InactiveConfigMock extends InactiveConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: InactiveService })
export class InactiveServiceMock {
    @Stub() init: jasmine.Spy;
}
