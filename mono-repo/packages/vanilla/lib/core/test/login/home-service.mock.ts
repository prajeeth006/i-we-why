import { HomeService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: HomeService })
export class HomeServiceMock {
    @Stub() goTo: jasmine.Spy;
    @Stub() getUrl: jasmine.Spy;
}
