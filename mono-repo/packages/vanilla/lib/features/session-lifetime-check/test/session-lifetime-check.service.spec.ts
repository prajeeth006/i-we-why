import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { SessionLifetimeCheckService } from '../src/session-lifetime-check.service';

describe('SessionLifetimeCheckService', () => {
    let service: SessionLifetimeCheckService;
    let authServiceMock: AuthServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        authServiceMock = MockContext.useMock(AuthServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [SessionLifetimeCheckService, MockContext.providers],
        });

        service = TestBed.inject(SessionLifetimeCheckService);
    });

    describe('checkIsSessionActive', () => {
        it('should not create Web worker if time left is 0', fakeAsync(() => {
            authServiceMock.sessionTimeLeft.and.resolveTo(0);

            service.checkIsSessionActive();
            tick();

            expect(webWorkerServiceMock.createWorker).not.toHaveBeenCalled();
        }));

        it('should create Web worker if time left is greater than 0', fakeAsync(() => {
            authServiceMock.sessionTimeLeft.and.resolveTo(1000);

            service.checkIsSessionActive();
            tick(7000);

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(
                WorkerType.SessionLifetimeCheckTimeout,
                { timeout: 6000 },
                jasmine.any(Function),
            );
        }));
    });
});
