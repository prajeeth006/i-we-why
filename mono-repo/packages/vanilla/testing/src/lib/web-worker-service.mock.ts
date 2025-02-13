import { WebWorkerService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';

export const WebWorkerServiceMock = () =>
    MockService(WebWorkerService, {
        createWorker: jest.fn().mockImplementation(function (
            this: WebWorkerService,
            type: string,
            options?: { timeout?: number; interval?: number },
            onmessage?: () => void,
        ) {
            if (onmessage) {
                if (options?.timeout ?? options?.interval) {
                    const timerId = setTimeout(() => {
                        onmessage();
                        clearTimeout(timerId);
                        clearInterval(timerId);
                    }, options?.timeout ?? options?.interval);
                    // @ts-expect-error - We know that workers is a Map
                    this?.workers?.set(type, timerId);
                } else if (!options?.interval) {
                    onmessage();
                }
            }
        }),
        getWorker: jest.fn(),
        removeWorker: jest.fn().mockImplementation(function (this: WebWorkerService, type: string) {
            // @ts-expect-error - We know that workers is a Map of string to NodeJS.Timeout
            const timerId = this.workers.get(type) as NodeJS.Timeout;
            clearTimeout(timerId);
            clearInterval(timerId);
            // @ts-expect-error - We know that workers is a Map
            this.workers.delete(type);
        }),
    });

export const WebWorkerServiceProviderMock = () => MockProvider(WebWorkerService, WebWorkerServiceMock());
