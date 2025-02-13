import { CookieService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const CookieServiceMock = MockService(CookieService, {
    get: jest.fn(),
    getAll: jest.fn(),
    getObject: jest.fn(),
    getQueryCollection: jest.fn(),
    put: jest.fn(),
    putRaw: jest.fn(),
    putObject: jest.fn(),
    addToQueryCollection: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
});
