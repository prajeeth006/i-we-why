import { FrontendHelperService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: FrontendHelperService })
export class FrontendHelperServiceMock {
    @Stub() getFrontendDescription: jasmine.Spy;
}
