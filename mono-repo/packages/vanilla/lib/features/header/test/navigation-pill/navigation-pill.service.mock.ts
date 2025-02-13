import { Mock, Stub, StubObservable } from 'moxxi';

import { NavigationPillService } from '../../src/navigation-pill/navigation-pill.service';

@Mock({ of: NavigationPillService })
export class NavigationPillServiceMock {
    @StubObservable() activeNavigationPill: jasmine.ObservableSpy;
    @StubObservable() activeFilterPill: jasmine.ObservableSpy;

    @Stub() resetActiveItem: jasmine.Spy;
    @Stub() setActiveItem: jasmine.Spy;
}
