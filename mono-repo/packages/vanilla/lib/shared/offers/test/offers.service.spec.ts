import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserSessionExpiredEvent, WorkerType } from '@frontend/vanilla/core';
import { OffersService } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';

import { MenuCountersServiceMock } from '../../../core/test/menus/menu-counters.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OffersResourceServiceMock } from './offers.mocks';

describe('OffersService', () => {
    let service: OffersService;
    let offersResourceServiceMock: OffersResourceServiceMock;
    let menuCountersServiceMock: MenuCountersServiceMock;
    let userServiceMock: UserServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        offersResourceServiceMock = MockContext.useMock(OffersResourceServiceMock);
        menuCountersServiceMock = MockContext.useMock(MenuCountersServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OffersService],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(OffersService);
    });

    describe('initPolling', () => {
        it('should update menu counters', fakeAsync(() => {
            const spy = jasmine.createSpy();

            service.counts.subscribe(spy);

            service.initPolling(60000);

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.OffersTimeout);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.OffersInterval);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(WorkerType.OffersTimeout, { timeout: 15000 }, jasmine.any(Function));

            tick(15000);

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(WorkerType.OffersInterval, { interval: 60000 }, jasmine.any(Function));

            offersResourceServiceMock.getCount.completeWith({ offers: [{ key: 'ALL', value: 1 }] });

            expect(spy).toHaveBeenCalledWith([{ key: 'ALL', value: 1 }]);
            expect(menuCountersServiceMock.update).toHaveBeenCalled();

            tick(60000);
            offersResourceServiceMock.getCount.completeWith({ offers: [{ key: 'ALL', value: 2 }] });

            expect(spy).toHaveBeenCalledWith([{ key: 'ALL', value: 2 }]);
            expect(menuCountersServiceMock.update).toHaveBeenCalled();

            userServiceMock.triggerEvent(new UserSessionExpiredEvent());
            tick(60000);

            expect(offersResourceServiceMock.getCount.calls.count()).toBe(2);
        }));

        it('get count should return 0 when offers property is not an array', () => {
            service.initPolling(60000);

            offersResourceServiceMock.getCount.completeWith({ offers: { key: 'ALL', value: 1 } });
            expect(service.getCount('All')).toBe(0);
        });
    });

    describe('stopPolling', () => {
        it('should remove the Web workers', () => {
            service.stopPolling();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.OffersTimeout);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.OffersInterval);
        });
    });
});
