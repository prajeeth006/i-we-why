import { Logger } from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';

export const LoggerProviderMock = () =>
    MockProvider(Logger, {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        errorRemote: jest.fn(),
        warnRemote: jest.fn(),
        infoRemote: jest.fn(),
    });
