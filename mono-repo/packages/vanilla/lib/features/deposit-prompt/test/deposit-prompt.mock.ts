import { Mock, Stub, StubPromise } from 'moxxi';

import { DepositPromptService } from '../src/deposit-prompt.service';

@Mock({ of: DepositPromptService })
export class DepositPromptServiceMock {
    @Stub() atStartup: jasmine.Spy;
    @StubPromise() postLogin: jasmine.PromiseSpy;
}
