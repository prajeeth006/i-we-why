import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OfflinePageBootstrapService } from '../src/offline-page-bootstrap.service';
import { OfflinePageConfigMock } from './offline-page.mock';

describe('OfflinePageBootstrapService', () => {
    let service: OfflinePageBootstrapService;
    let offlinePageConfigMock: OfflinePageConfigMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let authServiceMock: AuthServiceMock;

    beforeEach(() => {
        offlinePageConfigMock = MockContext.useMock(OfflinePageConfigMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OfflinePageBootstrapService],
        });

        offlinePageConfigMock.pollInterval = 1;

        service = TestBed.inject(OfflinePageBootstrapService);
    });

    it('onFeatureInit', fakeAsync(() => {
        service.onFeatureInit();
        offlinePageConfigMock.whenReady.next();
        tick();

        expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
            WorkerType.OfflinePagePollInterval,
            { interval: offlinePageConfigMock.pollInterval },
            jasmine.any(Function),
        );

        tick(1);

        expect(authServiceMock.isAuthenticated).toHaveBeenCalled();

        discardPeriodicTasks();
    }));
});
