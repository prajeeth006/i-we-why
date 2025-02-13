import { Injectable, inject } from '@angular/core';

import { TimerService, WINDOW, WindowEvent } from '@frontend/vanilla/core';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { firstValueFrom } from 'rxjs';

import { TrackingConfig } from './tracking.client-config';

@Injectable({ providedIn: 'root' })
export class DataLayerProxyService {
    private trackingConfig = inject(TrackingConfig);
    private timerService = inject(TimerService);
    private strategyProvider = inject(RxStrategyProvider);
    readonly #window = inject(WINDOW);

    private requiredEvents = [
        WindowEvent.VanillaGtmLoaded,
        WindowEvent.GtmLoad,
        'webVital',
        'gtm.js',
        'webVital',
        'OptanonLoaded',
        'OneTrustLoaded',
        'OneTrustGroupsUpdated',
    ];
    private patched = false;
    private schedulerEnabled = false;

    async patchDataLayer(forceSchedulerDisabled = false) {
        await firstValueFrom(this.trackingConfig.whenReady);
        this.schedulerEnabled = !forceSchedulerDisabled && this.trackingConfig.schedulerEnabled;

        if (
            !this.patched &&
            this.trackingConfig.isEnabled &&
            (this.trackingConfig.enableLogging || this.schedulerEnabled || this.trackingConfig.enableOmitting)
        ) {
            this.#window[this.trackingConfig.dataLayerName] = this.createDataLayerProxy(this.#window[this.trackingConfig.dataLayerName]);
            this.patched = true;
        }
    }

    // this proxy is here to make sure the `requestIdleCallback` is always
    // wrapped around the most outer function call
    // all gtm containers apply monkey-patches to the dataLayer.push method
    // while respecting already applied patches
    // we end up in a chain of overridden function bodies
    // to make sure the `requestIdleCallback` is the most outer function
    // we use a Proxy that keeps track of overrides to the `push` method
    private createDataLayerProxy(origDataLayer = []) {
        const idleWrapper = (fn: Function) => {
            this.timerService.scheduleIdleCallback(() => {
                // make sure that tracking is executed after the render queue is empty
                this.strategyProvider
                    .schedule(() => fn(), {
                        patchZone: false,
                        strategy: 'idle',
                    })
                    .subscribe();
            }, this.trackingConfig.trackingDelay);

            return origDataLayer.length + 1;
        };

        const { enableOmitting, omitAll, enableLogging } = this.trackingConfig;
        const schedulerEnabled = this.schedulerEnabled;
        const blockDevice = this.trackingConfig.deviceBlockEnabled && this.isLowTierDevice();
        const isNextCallSuppressed = this.isNextCallSuppressed.bind(this);
        const allowlist = new Set(...(this.trackingConfig.allowlist || []), ...this.requiredEvents);
        const blocklist = new Set(this.trackingConfig.blocklist || []);
        const window = this.#window;
        const measureTask = measureTaskDuration;

        return new Proxy<unknown[]>(origDataLayer, {
            set(target, key, newValue: unknown) {
                if (key === 'push') {
                    target[key] = (...args: any) => {
                        const eventName = args?.[0]?.event;

                        const shouldBeOmitted =
                            // check if omitting feature is enabled
                            enableOmitting &&
                            // not in allowlist
                            !allowlist.has(eventName) &&
                            // omit all OR in blocklist OR low tier device blocking enabled and device is slow OR percentage blocking enabled and event got in range
                            (omitAll || blocklist.has(eventName) || blockDevice || isNextCallSuppressed());

                        if (shouldBeOmitted) {
                            return () => 0;
                        }

                        const callback: Function = () => {
                            const work = (newValue as Function).bind(target, ...args);

                            if (enableLogging || window.logTrackingPerformance) {
                                return measureTask(work, args, eventName);
                            }
                            return work();
                        };

                        return schedulerEnabled ? idleWrapper(callback) : callback();
                    };
                } else {
                    target[key as any] = newValue;
                }

                return true;
            },
        });
    }

    private isLowTierDevice(): boolean {
        const deviceConcurrency = navigator.hardwareConcurrency;
        const minDeviceConcurrency = this.trackingConfig.deviceConcurrency;

        if (minDeviceConcurrency && deviceConcurrency && deviceConcurrency <= minDeviceConcurrency) {
            return true;
        }

        const minDeviceMemory = this.trackingConfig.deviceMemory;
        const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;

        if (minDeviceMemory && deviceMemory && deviceMemory <= minDeviceMemory) {
            return true;
        }

        const benchmarkThreshold = this.trackingConfig.benchmarkThreshold;

        return !!(benchmarkThreshold && benchmark() > benchmarkThreshold);
    }

    private isNextCallSuppressed(): boolean {
        const omitPercentage = this.trackingConfig.omitPercentage;

        return !!omitPercentage && Math.random() * 100 <= omitPercentage;
    }
}

function isPrime(num: number): boolean {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) {
            return false;
        }
    }

    return num > 1;
}

function calculatePrimes(max: number): number[] {
    const primes: number[] = [];

    for (let i = 1; i < max; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }

    return primes;
}

function benchmark(): number {
    const start = performance.now();
    calculatePrimes(20_000);

    return performance.now() - start;
}

function measureTaskDuration(work: Function, args: unknown, eventName: string) {
    const startTime = performance.now();
    const name = eventName || '[anonymous event]';
    const startMark = `GTM Event ${name} start`;
    performance.mark(`GTM Event ${name} start`);
    const r = work();
    const endMark = `GTM Event ${name} end`;
    performance.mark(endMark);
    performance.measure(`GTM Event ${name}`, startMark, endMark);
    const endTime = performance.now();

    const runtime = Math.ceil(endTime - startTime);
    const color = runtime >= 100 ? 'red' : 'green';

    // eslint-disable-next-line no-console
    console.log(`Analytics tracking: ${name} took %c${runtime}ms`, `color: ${color}`, {
        withArgs: args,
    });

    return r;
}
