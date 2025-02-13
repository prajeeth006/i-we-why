import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const SharedFeaturesApiServiceMock = MockService(SharedFeaturesApiService, {
    request: jest.fn(),
    jsonp: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
});
