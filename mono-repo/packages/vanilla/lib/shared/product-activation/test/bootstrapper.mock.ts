import { BootstrapperPhase, BootstrapperService } from '@frontend/vanilla/core';
import { Mock, StubPromise } from 'moxxi';

@Mock({ of: BootstrapperService })
export class BootstrapperServiceMock {
    phase: BootstrapperPhase;
    @StubPromise() runAppInit: jasmine.PromiseSpy;
    @StubPromise() runAfterConfigLoaded: jasmine.PromiseSpy;
    @StubPromise() runProductLoad: jasmine.PromiseSpy;
    @StubPromise() runProductActivation: jasmine.PromiseSpy;
    @StubPromise() runProductDeactivation: jasmine.PromiseSpy;
}
