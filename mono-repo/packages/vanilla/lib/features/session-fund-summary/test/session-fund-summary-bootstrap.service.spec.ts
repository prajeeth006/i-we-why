import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LoginServiceMock } from '../../../shared/login/test/login.service.mock';
import { SessionFundSummaryServiceMock } from '../../../shared/session-fund-summary/test/session-fund-summary-service.mocks';
import { SessionFundSummaryBootstrapService } from '../src/session-fund-summary-bootstrap.service';

describe('SessionFundSummaryBootstrapService', () => {
    let service: SessionFundSummaryBootstrapService;
    let sessionFundSummaryServiceMock: SessionFundSummaryServiceMock;
    let loginServiceMock: LoginServiceMock;

    beforeEach(() => {
        sessionFundSummaryServiceMock = MockContext.useMock(SessionFundSummaryServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionFundSummaryBootstrapService],
        });

        service = TestBed.inject(SessionFundSummaryBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should refresh session fund summary on runAfterLogin', () => {
            loginServiceMock.runAfterLogin.and.callFake((_, callback) => callback());

            service.onFeatureInit();

            expect(loginServiceMock.runAfterLogin).toHaveBeenCalledOnceWith(SessionFundSummaryBootstrapService.name, jasmine.any(Function));
            expect(sessionFundSummaryServiceMock.refresh).toHaveBeenCalledTimes(1);
        });
    });
});
