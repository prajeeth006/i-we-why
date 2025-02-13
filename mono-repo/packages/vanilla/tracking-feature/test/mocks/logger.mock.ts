import { Logger } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const LoggerMock = MockService(Logger, {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    errorRemote: jest.fn(),
    warnRemote: jest.fn(),
    infoRemote: jest.fn(),
});
