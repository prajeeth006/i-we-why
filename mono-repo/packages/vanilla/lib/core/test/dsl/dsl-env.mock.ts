import { DslEnvService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: DslEnvService })
export class DslEnvServiceMock {
    @Stub() run: jasmine.Spy;
    @Stub() registerDefaultValuesNotReadyDslProviders: jasmine.Spy;
    @StubObservable() whenStable: jasmine.ObservableSpy;
    change: Subject<Set<string>> = new Subject<Set<string>>();
}
