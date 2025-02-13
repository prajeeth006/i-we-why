import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { BetstationHardwareFaultConfig } from '../src/betstation-hardware-fault.client-config';
import { BetstationHardwareFaultService } from '../src/betstation-hardware-fault.service';

@Mock({ of: BetstationHardwareFaultConfig })
export class BetstationHardwareFaultConfigMock extends BetstationHardwareFaultConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: BetstationHardwareFaultService })
export class BetstationHardwareFaultServiceMock {
    @Stub() showOverlay: jasmine.Spy;
    @Stub() closeOverlay: jasmine.Spy;
}
