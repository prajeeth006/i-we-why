import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

describe('WebWorkerService', () => {
    let service: WebWorkerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers, WebWorkerService],
        });

        service = TestBed.inject(WebWorkerService);

        service.createWorker(WorkerType.InactivityScreenTimeout, { timeout: 10000 }, () => postMessage(WorkerType.InactivityScreenTimeout));
    });

    describe('createWorker', () => {
        it('should post message when complete', fakeAsync(() => {
            const worker = service.getWorker(WorkerType.InactivityScreenTimeout) || {
                onmessage: () => {},
            };

            tick(10000);

            worker.onmessage = (message: MessageEvent<any>) => {
                expect(message.data).toBe(WorkerType.InactivityScreenTimeout);
            };
        }));
    });

    describe('getWorker', () => {
        it('should return worker', () => {
            expect(service.getWorker(WorkerType.InactivityScreenTimeout)).toBeDefined();
        });
    });

    describe('removeWorker', () => {
        it('should remove worker and return elapsed time', fakeAsync(() => {
            tick(4000);

            const elapsedTime = service.removeWorker(WorkerType.InactivityScreenTimeout);

            expect(elapsedTime).toBe(4);
        }));
    });
});
