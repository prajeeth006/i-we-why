import { Mock, Stub } from 'moxxi';

import { ResizeObserverService } from './resize-observer.service';

@Mock({ of: ResizeObserverService })
export class ResizeObserverServiceMock {
    @Stub() observe: jasmine.Spy;
}
