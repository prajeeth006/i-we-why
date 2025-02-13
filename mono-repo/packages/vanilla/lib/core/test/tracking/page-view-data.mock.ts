import { PageViewDataService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: PageViewDataService })
export class PageViewDataServiceMock {
    @Stub() installListener: jasmine.Spy;
    @Stub() uninstallListener: jasmine.Spy;
    @Stub() setDataForNavigation: jasmine.Spy;
}
