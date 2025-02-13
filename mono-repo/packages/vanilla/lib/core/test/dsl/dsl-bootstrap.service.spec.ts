import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DslBootstrapService } from '../../src/dsl/dsl-bootstrap.service';
import { DslConfigMock } from './dsl-config.mock';
import { DslEnvServiceMock } from './dsl-env.mock';

describe('DslBootstrapService', () => {
    let service: DslBootstrapService;
    let dslEnvServiceMock: DslEnvServiceMock;
    let dslConfigMock: DslConfigMock;

    beforeEach(() => {
        dslEnvServiceMock = MockContext.useMock(DslEnvServiceMock);
        dslConfigMock = MockContext.useMock(DslConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslBootstrapService],
        });
        service = TestBed.inject(DslBootstrapService);
    });

    it('should initialize unregistered providers', () => {
        const unregisteredProviders = { test: 55, balu: 'fsafd' };
        dslConfigMock.defaultValuesUnregisteredProvider = unregisteredProviders;

        service.onAppInit();

        expect(dslEnvServiceMock.registerDefaultValuesNotReadyDslProviders).toHaveBeenCalledWith(unregisteredProviders);
    });
});
