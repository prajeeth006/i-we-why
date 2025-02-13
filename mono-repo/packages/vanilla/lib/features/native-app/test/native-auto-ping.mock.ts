import { Mock, Stub } from 'moxxi';

import { NativeAutoPingService } from '../src/native-auto-ping.service';

@Mock({ of: NativeAutoPingService })
export class NativeAutoPingServiceMock {
    @Stub() init: jasmine.Spy;
}
