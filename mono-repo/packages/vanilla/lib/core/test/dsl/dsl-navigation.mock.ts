import { DslNavigationService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

import { ParsedUrlMock } from '../navigation/navigation.mock';

@Mock({ of: DslNavigationService })
export class DslNavigationServiceMock {
    location: ParsedUrlMock = new ParsedUrlMock();
    @Stub() enqueueRedirect: jasmine.Spy;
}
