import { MockService } from 'ng-mocks';

import { PageViewTrackingService } from '../../src/page-view-tracking.service';

export const PageViewTrackingServiceMock = MockService(PageViewTrackingService, {
    trackPageView: jest.fn(),
});
