import { RouteDataService } from '@frontend/vanilla/shared/routing';
import { Mock, Stub } from 'moxxi';

@Mock({ of: RouteDataService })
export class RouteDataServiceMock {
    @Stub() getInitData: jasmine.Spy;
    @Stub() get: jasmine.Spy;
}
