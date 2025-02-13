import { DslService, PersistentDslService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: DslService })
export class DslServiceMock {
    @StubObservable() evaluateContent: jasmine.ObservableSpy;
    @StubObservable() evaluateExpression: jasmine.ObservableSpy;
    @StubObservable() executeAction: jasmine.ObservableSpy;
}

@Mock({ of: PersistentDslService })
export class PersistentDslServiceMock {
    @Stub() getResult: jasmine.Spy;
}
