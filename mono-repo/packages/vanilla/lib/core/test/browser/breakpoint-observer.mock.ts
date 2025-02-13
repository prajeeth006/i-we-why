import { BreakpointObserver } from '@angular/cdk/layout';

import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: BreakpointObserver })
export class BreakpointObserverMock {
    @StubObservable() observe: jasmine.ObservableSpy;
    @Stub() isMatched: jasmine.Spy;
}
