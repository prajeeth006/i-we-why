import { Mock, StubObservable } from 'moxxi';

import { NonRunnersService } from '../services/data-feed/non-runners.service';

@Mock({ of: NonRunnersService })
export class NonRunnersServiceMock {
    @StubObservable() vm: jasmine.ObservableSpy;
}
