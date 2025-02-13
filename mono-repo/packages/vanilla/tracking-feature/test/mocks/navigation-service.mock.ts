import { ImmutableParsedUrl, LocationChangeEvent, NavigationService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';
import { Subject } from 'rxjs';

import { ParsedUrlMock } from './parsed-url.mock';

export const NavigationServiceMock = MockService(NavigationService, {
    locationChange: new Subject<LocationChangeEvent>(),
    get location(): ImmutableParsedUrl {
        return ParsedUrlMock as unknown as ImmutableParsedUrl;
    },
});
