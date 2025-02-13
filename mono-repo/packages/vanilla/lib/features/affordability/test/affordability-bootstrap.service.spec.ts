import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LoginServiceMock } from '../../../shared/login/test/login.service.mock';
import { AffordabilityBootstrapService } from '../src/affordability-bootstrap.service';
import { AffordabilityServiceMock } from './affordability.mock';

describe('AffordabilityBootstrapService', () => {
    let service: AffordabilityBootstrapService;
    let affordabilityServiceMock: AffordabilityServiceMock;
    let loginServiceMock: LoginServiceMock;

    beforeEach(() => {
        affordabilityServiceMock = MockContext.useMock(AffordabilityServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);

        TestBed.configureTestingModule({
            providers: [AffordabilityBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(AffordabilityBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should load from API on runAfterLogin', () => {
            loginServiceMock.runAfterLogin.and.callFake((_, callback) => callback());

            service.onFeatureInit();

            expect(loginServiceMock.runAfterLogin).toHaveBeenCalledOnceWith(AffordabilityBootstrapService.name, jasmine.any(Function));
            expect(affordabilityServiceMock.load).toHaveBeenCalledTimes(1);
        });
    });
});
