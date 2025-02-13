import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { RedirectMessageTrackingService } from '../src/redirect-message-tracking.service';
import { RedirectMessageConfig } from '../src/redirect-message.client-config';
import { RedirectMessageService } from '../src/redirect-message.service';

@Mock({ of: RedirectMessageConfig })
export class RedirectMessageConfigMock extends RedirectMessageConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();

        this.content = {
            text: 'You will be redirected to {REDIRECT_LABEL}',
            messages: {
                continue: '{REDIRECT_LABEL}',
                return: 'bwin.es',
            },
        };
    }
}

@Mock({ of: RedirectMessageService })
export class RedirectMessageServiceMock {
    @Stub() tryShowMessage: jasmine.Spy;
}

@Mock({ of: RedirectMessageTrackingService })
export class RedirectMessageTrackingServiceMock {
    @Stub() trackDisplay: jasmine.Spy;
    @Stub() trackRedirect: jasmine.Spy;
    @Stub() trackReturn: jasmine.Spy;
}
