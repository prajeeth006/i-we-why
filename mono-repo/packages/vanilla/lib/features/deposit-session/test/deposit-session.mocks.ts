import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { DepositSessionOverlayService } from '../src/deposit-session-overlay.service';
import { DepositSessionConfig } from '../src/deposit-session.client-config';

@Mock({ of: DepositSessionConfig })
export class DepositSessionConfigMock extends DepositSessionConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: DepositSessionOverlayService })
export class DepositSessionOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}
