import { Mock, Stub } from 'moxxi';

import { WebWorkerOptions } from '../../src/web-worker/web-worker.models';
import { WebWorkerService } from '../../src/web-worker/web-worker.service';

@Mock({ of: WebWorkerService })
export class WebWorkerServiceMock {
    @Stub() createWorker: jasmine.Spy;
    @Stub() getWorker: jasmine.Spy;
    @Stub() removeWorker: jasmine.Spy;
    private workers: Map<string, any> = new Map();

    constructor() {
        this.createWorker.and.callFake((type: string, options?: WebWorkerOptions, onmessage?: () => void) => {
            if (onmessage) {
                if (options?.timeout || options?.interval) {
                    const timerId = setTimeout(() => {
                        onmessage();
                        clearTimeout(timerId);
                        clearInterval(timerId);
                    }, options?.timeout || options?.interval);
                    this.workers.set(type, timerId);
                } else if (!options?.interval) {
                    onmessage();
                }
            }
        });

        this.removeWorker.and.callFake((type: string) => {
            const timerId = this.workers.get(type);
            clearTimeout(timerId);
            clearInterval(timerId);
            this.workers.delete(type);
        });
    }
}
