import { Injectable, NgZone, inject } from '@angular/core';

import { clearTimeout as unpatchedClearTimeout, setTimeout as unpatchedSetTimeout } from '@rx-angular/cdk/zone-less/browser';

const hasIdleCallback = typeof window.requestIdleCallback === 'function';

const requestIdleCallback = !hasIdleCallback
    ? (cb: Function, options?: IdleRequestOptions) => unpatchedSetTimeout(cb, options?.timeout ?? 0)
    : window.requestIdleCallback;

const cancelIdleCallback = !hasIdleCallback ? (handle: number) => unpatchedClearTimeout(handle) : window.cancelIdleCallback;

/**
 * @whatItDoes Sets interval outside angular zone.
 *
 * @description
 *
 * This is because protractor e2e tests hang when interval is running inside angular zone. This service
 * is downgraded as `$interval` for AngularJS to work around this problem.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class TimerService {
    private zone = inject(NgZone);

    scheduleIdleCallback(cb: () => void, timeout = 0): () => void {
        const handle = requestIdleCallback(cb, { timeout });
        return () => cancelIdleCallback(handle);
    }

    // NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
    /**
     * @deprecated
     *
     * Use {@link WebWorkerService.createWorker} instead.
     */
    setIntervalOutsideAngularZone(operation: () => void, frequency: number = 0): NodeJS.Timeout {
        let intervalId: any;

        this.zone.runOutsideAngular(() => {
            intervalId = setInterval(() => {
                operation();
            }, frequency);
        });

        return intervalId;
    }

    setTimeoutOutsideAngularZone(operation: () => void, timeout: number = 0): NodeJS.Timeout {
        let timeoutId: any;

        this.zone.runOutsideAngular(() => {
            timeoutId = setTimeout(() => {
                this.zone.run(() => operation());
            }, timeout);
        });

        return timeoutId;
    }

    /**
     * @deprecated
     *
     * Use {@link WebWorkerService.createWorker} instead.
     */
    setInterval(operation: () => void, frequency: number = 0): NodeJS.Timeout {
        return setInterval(() => operation(), frequency);
    }

    setTimeout(operation: () => void, timeout: number = 0): NodeJS.Timeout {
        return setTimeout(() => operation(), timeout);
    }

    /**
     * @deprecated
     *
     * Use {@link WebWorkerService.removeWorker} instead.
     */
    clearInterval(intervalId: string | number | NodeJS.Timeout | undefined) {
        clearInterval(intervalId);
    }

    clearTimeout(timeoutId: NodeJS.Timeout | string | number | undefined) {
        clearTimeout(timeoutId);
    }
}
