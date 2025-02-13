import { TrackingServiceProvider } from '@frontend/vanilla/core';

export class TrackingServiceProviderMock implements TrackingServiceProvider {
    addInitialValues = jest.fn();
    getContentItemTracking = jest.fn();
    trackContentItemEvent = jest.fn();
    updateUserContactabilityStatus = jest.fn();
    updateUserValues = jest.fn();
    updateDataLayer = jest.fn();
    trackEvents = jest.fn();
    triggerEvent = jest.fn();
    reportError = jest.fn();
    reportErrorObject = jest.fn();
    setReferrer = jest.fn();
}
