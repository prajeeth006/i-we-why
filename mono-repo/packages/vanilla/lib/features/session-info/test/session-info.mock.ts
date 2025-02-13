import { Mock, Stub, StubPromise } from 'moxxi';

import { SessionInfoOverlayService } from '../src/session-info-overlay.service';
import { SessionInfoResourceService } from '../src/session-info-resource.service';
import { SessionInfoService } from '../src/session-info.service';

@Mock({ of: SessionInfoOverlayService })
export class SessionInfoOverlayServiceMock {
    @Stub() show: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    @Stub() init: jasmine.Spy;
}

@Mock({ of: SessionInfoResourceService })
export class SessionInfoResourceServiceMock {
    @StubPromise() rcpuStatus: jasmine.PromiseSpy;
    @StubPromise() rcpuContinue: jasmine.PromiseSpy;
    @StubPromise() rcpuQuit: jasmine.PromiseSpy;
}

@Mock({ of: SessionInfoService })
export class SessionInfoServiceMock {
    @Stub() checkStatus: jasmine.Spy;
    @Stub() processMessage: jasmine.Spy;
}
