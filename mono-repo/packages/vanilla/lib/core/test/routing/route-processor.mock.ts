import { Mock, Stub } from 'moxxi';

import { RouteProcessorService } from '../../src/routing/route-processor.service';

@Mock({ of: RouteProcessorService })
export class RouteProcessorServiceMock {
    @Stub() processRoutes: jasmine.Spy;
}
