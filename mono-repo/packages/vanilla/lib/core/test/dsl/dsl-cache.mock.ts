import { DslCacheService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: DslCacheService })
export class DslCacheServiceMock {
    @Stub() get: jasmine.Spy;
    @Stub() set: jasmine.Spy;
    @Stub() invalidate: jasmine.Spy;
    invalidation: Subject<Set<string>> = new Subject<Set<string>>();
    @StubObservable() whenStable: jasmine.ObservableSpy;
}
