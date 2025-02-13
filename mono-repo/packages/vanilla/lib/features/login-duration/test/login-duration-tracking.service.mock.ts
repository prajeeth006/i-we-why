import { Mock, Stub } from 'moxxi';

import { LoginDurationTrackingService } from '../src/login-duration-tracking.service';

@Mock({ of: LoginDurationTrackingService })
export class LoginDurationTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
}
