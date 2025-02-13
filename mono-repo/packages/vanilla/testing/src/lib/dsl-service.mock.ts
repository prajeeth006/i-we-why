import { DslService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';

export const DslServiceMock = () =>
    MockService(DslService, {
        evaluateContent: jest.fn(),
        evaluateExpression: jest.fn(),
        executeAction: jest.fn(),
    });

export const DslServiceProviderMock = () => MockProvider(DslService, DslServiceMock());
