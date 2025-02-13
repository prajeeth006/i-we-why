import { Injectable, NgZone, inject } from '@angular/core';

import { Logger } from '../logging/logger';
import { WebWorker, WebWorkerOptions } from './web-worker.models';

/**
 * @description
 *
 * This service provides means to register Web workers to run scripts in background threads.
 * The worker thread can perform tasks without interfering with the user interface.
 * In addition, it will run even when the browser is inactive.
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class WebWorkerService {
    private log = inject(Logger);
    private zone = inject(NgZone);

    private workers = new Map<string, WebWorker>();

    /**
     * @description Create worker that will be added to the workers list. Web worker does not work for embedded components.
     * @param type Worker type.
     * @param options additional options to use `setTimeout` or `setInterval`.
     * @param onmessage optional callback that will be executed on worker message.
     * @param callback optional callback that will run inside the worker. Should be self-contained code: `() => { ... }`.
     * @return `Worker` or `undefined` if Web workers are not supported.
     */
    createWorker(type: string, options: WebWorkerOptions = {}, onmessage?: () => void, callback?: () => any): Worker | undefined {
        if (typeof Worker === 'undefined') {
            this.log.error(`Worker: ${type} cannot be created. Web workers are not supported.`);
            return undefined;
        }

        if (this.getWorker(type)) {
            return undefined; // Worker already exist
        }

        callback = callback || <any>`()  => { self.postMessage('${type}') }`;
        let blob: any;

        if (Number(options.timeout) >= 0) {
            blob = `setTimeout(${callback}, ${options.timeout})`;
        } else if (Number(options.interval) >= 0) {
            blob = `setInterval(${callback}, ${options.interval})`;
        } else {
            blob = callback;
        }

        const workerBlob = new Blob([blob.toString()], { type: 'text/javascript' });
        const worker = new Worker(URL.createObjectURL(workerBlob));

        this.workers.set(type, { worker, startTime: new Date().getTime() });

        if (onmessage) {
            if (options.runInsideAngularZone) {
                worker.onmessage = onmessage;
            } else {
                this.zone.runOutsideAngular(() => {
                    worker.onmessage = onmessage;
                });
            }
        }

        return worker;
    }

    /**
     * @description Get Web worker by {@link WorkerType}.
     * @return `Worker` or `undefined` if not found in the workers list.
     */
    getWorker(type: string): Worker | undefined {
        return this.workers.get(type)?.worker;
    }

    /**
     * @description Remove worker by {@link WorkerType}.
     * @return Elapsed time in seconds.
     */
    removeWorker(type: string): number {
        const workerInfo = this.workers.get(type);

        if (workerInfo) {
            workerInfo.worker.terminate();
            const elapsedTime = Math.round((new Date().getTime() - workerInfo.startTime) / 1000);

            this.workers.delete(type);

            return elapsedTime;
        }

        return 0;
    }
}
