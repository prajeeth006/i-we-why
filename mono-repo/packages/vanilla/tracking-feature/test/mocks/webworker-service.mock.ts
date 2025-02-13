import { WebWorkerOptions, WebWorkerService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

const workers = new Map<string, any>();

export const WebWorkerServiceMock = MockService(WebWorkerService, {
    createWorker: jest.fn((type: string, options?: WebWorkerOptions, onmessage?: () => void): Worker | undefined => {
        if (onmessage) {
            if (options?.timeout || options?.interval) {
                const timerId = setTimeout(() => {
                    onmessage();
                    clearTimeout(timerId);
                    clearInterval(timerId);
                }, options?.timeout || options?.interval);

                workers.set(type, timerId);
            } else if (!options?.interval) {
                onmessage();
            }
        }
        return undefined;
    }),
    getWorker: jest.fn(),
    removeWorker: jest.fn((type: string): number => {
        const timerId = workers.get(type);
        if (timerId) {
            clearTimeout(timerId);
            clearInterval(timerId);
            workers.delete(type); // Remove worker from map
        }
        return 0;
    }),
});
