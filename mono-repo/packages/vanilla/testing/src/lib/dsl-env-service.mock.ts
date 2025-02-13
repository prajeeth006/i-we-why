import { DslEnvService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';
import { Subject, of } from 'rxjs';

export const DslEnvServiceMock = () =>
    MockService(DslEnvService, {
        run: jest.fn(),
        registerDefaultValuesNotReadyDslProviders: jest.fn(),
        whenStable: jest.fn().mockReturnValue(of(void 0)),
        change: new Subject<Set<string>>(),
    });

export const DslEnvServiceProviderMock = () => MockProvider(DslEnvService, DslEnvServiceMock());
