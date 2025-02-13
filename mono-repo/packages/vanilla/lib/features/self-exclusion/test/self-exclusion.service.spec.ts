import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { SelfExclusionService } from '../src/self-exclusion.service';
import { SelfExclusionConfigMock } from './self-exclusion.mock';

describe('SelfExclusionService', () => {
    let service: SelfExclusionService;
    let selfExclusionConfigMock: SelfExclusionConfigMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        selfExclusionConfigMock = MockContext.useMock(SelfExclusionConfigMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SelfExclusionService],
        });

        selfExclusionConfigMock.updateInterval = 2000;
        spy = jasmine.createSpy();
        service = TestBed.inject(SelfExclusionService);
        service.details.subscribe(spy);
    });

    describe('init', () => {
        it('should do initial api call', () => {
            service.init();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.SelfExclusionPollInterval,
                { interval: selfExclusionConfigMock.updateInterval },
                jasmine.any(Function),
            );
            expect(apiServiceMock.get).toHaveBeenCalledWith('selfexclusion');

            apiServiceMock.get.next({ categoryId: 'self' });

            expect(spy).toHaveBeenCalledWith({ categoryId: 'self' });
        });

        it('should poll in configured interval for count and notify subscribers', fakeAsync(() => {
            service.init();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.SelfExclusionPollInterval,
                { interval: selfExclusionConfigMock.updateInterval },
                jasmine.any(Function),
            );
            expect(apiServiceMock.get).toHaveBeenCalled();

            apiServiceMock.get.next({ categoryId: 'self' });

            expect(spy).toHaveBeenCalledWith({ categoryId: 'self' });

            tick(2000);

            expect(apiServiceMock.get).toHaveBeenCalledTimes(2);

            apiServiceMock.get.next({ categoryId: 'yours' });

            expect(spy).toHaveBeenCalledWith({ categoryId: 'yours' });

            discardPeriodicTasks();
        }));
    });

    describe('stopPolling', () => {
        it('should remove worker', () => {
            service.stopPolling();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.SelfExclusionPollInterval);
        });
    });
});
