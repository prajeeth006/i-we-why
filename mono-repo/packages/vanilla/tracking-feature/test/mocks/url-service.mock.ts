import { UrlService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const UrlServiceMock = MockService(UrlService, {
    parse: jest.fn(),
    current: jest.fn(),
    appendReferrer: jest.fn(),
    isAbsolute: jest.fn(),
});
