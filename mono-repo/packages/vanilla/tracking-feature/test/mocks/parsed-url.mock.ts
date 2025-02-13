import { ParsedUrl, QuerySearchParams } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const ParsedUrlMock = MockService(ParsedUrl, {
    protocol: '',
    search: new QuerySearchParams(''),
    hash: '',
    hostname: '',
    port: '',
    pathname: '',
    isRelative: false,
    isSameHost: false,
    isSameTopDomain: false,
    culture: '',
    clone: jest.fn(),
    path: jest.fn(),
    absUrl: jest.fn(),
    url: jest.fn(),
    baseUrl: jest.fn(),
    host: jest.fn(),
    changeCulture: jest.fn(),
});
