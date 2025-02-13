import { TrackingService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const TrackingServiceMock = MockService(TrackingService, {
    triggerEvent: jest.fn(),
    addInitialValues: jest.fn(),
    trackEvents: jest.fn(),
    updateDataLayer: jest.fn(),
    updateUserValues: jest.fn(),
    reportError: jest.fn(),
    reportErrorObject: jest.fn(),
    setReferrer: jest.fn(),
    trackContentItemEvent: jest.fn(),
    updateUserContactabilityStatus: jest.fn(),
    // event: { pageView: 'pageView', userLogout: 'Event.Logout', functionality: 'Event.Functionality' },
    set: jest.fn(),
});
