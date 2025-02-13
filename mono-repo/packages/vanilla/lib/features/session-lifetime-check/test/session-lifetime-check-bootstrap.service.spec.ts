import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SessionLifetimeCheckBootstrapService } from '../src/session-lifetime-check-bootstrap.service';
import { SessionLifetimeCheckServiceMock } from './session-lifetime-check.mocks';

describe('SessionLifetimeCheckBootstrapService', () => {
    let service: SessionLifetimeCheckBootstrapService;
    let sessionLifetimeCheckService: SessionLifetimeCheckServiceMock;

    beforeEach(() => {
        sessionLifetimeCheckService = MockContext.useMock(SessionLifetimeCheckServiceMock);

        TestBed.configureTestingModule({
            providers: [SessionLifetimeCheckBootstrapService, MockContext.providers],
        });
        service = TestBed.inject(SessionLifetimeCheckBootstrapService);
    });

    it('should call checkIsSessionActive', () => {
        service.onFeatureInit();

        expect(sessionLifetimeCheckService.checkIsSessionActive).toHaveBeenCalled();
    });
});
