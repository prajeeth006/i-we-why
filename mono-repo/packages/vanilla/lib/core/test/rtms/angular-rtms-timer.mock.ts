import { Mock, Stub } from 'moxxi';

import { RtmsTimerService } from '../../../core/src/rtms/rtms-timer.service';

@Mock({ of: RtmsTimerService })
export class AngularRtmsTimerServiceMock {
    @Stub() setTimeout: jasmine.Spy;
    @Stub() setInterval: jasmine.Spy;
    @Stub() clearTimeout: jasmine.Spy;
    @Stub() clearInterval: jasmine.Spy;
}
