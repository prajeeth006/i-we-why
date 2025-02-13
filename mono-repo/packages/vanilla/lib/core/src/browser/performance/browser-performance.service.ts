import { Injectable, inject } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { Observable, ReplaySubject, Subject, Subscriber } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';

import { Page } from '../../client-config/page.client-config';
import { Logger } from '../../logging/logger';
import { round } from '../../utils/convert';
import { EventTimestamps, LoadingProfile, LoadingWaterfall, PerformanceProfile } from '../browser.models';
import { TimerService } from '../timer.service';
import { WindowEvent } from '../window/window-ref.service';
import { WINDOW } from '../window/window.token';

/**
 * @whatItDoes Provides helper methods on top of browser performance API.
 *
 * @description
 *
 * Make sure to check `isSupported` before accessing other APIs, otherwise they will throw if the browser doesn't support performance API.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class BrowserPerformanceService {
    readonly #window = inject(WINDOW);

    /** Whether the performance API is supported. */
    get isSupported(): boolean {
        return this._isSupported;
    }

    private get performance(): Performance {
        return this.#window.performance;
    }

    private profileSubject: ReplaySubject<PerformanceProfile>;
    private endMarkedEvents = new Subject<string>();
    private readonly _isSupported: boolean;

    constructor(
        private log: Logger,
        private router: Router,
        private page: Page,
        private timerService: TimerService,
    ) {
        this._isSupported = !!(this.performance && this.performance.getEntriesByType && this.performance.getEntriesByType('navigation')[0]);

        this.profileSubject = new ReplaySubject<PerformanceProfile>();
    }

    init() {
        if (this.isSupported) {
            const handler = () => this.timerService.setTimeout(() => this.profileSubject.next(this.getProfile()), 500);

            if (this.#window.document.readyState === 'complete') {
                handler();
            } else {
                this.#window.addEventListener(WindowEvent.Load, handler);
            }

            if (this.page.isProfilingEnabled) {
                this.router.events.pipe(filter((e: Event): e is NavigationStart => e instanceof NavigationStart)).subscribe((e: NavigationStart) => {
                    this.startMeasurement(`van_nav${e.id}`);
                });

                this.router.events.pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
                    this.endMeasurement(`van_nav${e.id}`);
                });
            }
        }
    }

    /**
     * Get page load profile of the app when it becomes available.
     */
    loadProfile(): Observable<PerformanceProfile> {
        this.requireSupport();

        return this.profileSubject.asObservable().pipe(shareReplay({ refCount: true }));
    }

    /**
     * Clears measurement with it's marks from the underlying API.
     */
    clearMeasurement(name: string) {
        this.requireSupport();

        this.performance.clearMarks(`${name}-start`);
        this.performance.clearMarks(`${name}-end`);
        this.performance.clearMeasures(name);
    }

    /**
     * Starts a measurement with the specified name.
     */
    startMeasurement(name: string) {
        this.requireSupport();

        this.performance.mark(`${name}-start`);
    }

    /**
     * Ends a measurement with the specified name.
     */
    endMeasurement(name: string) {
        this.requireSupport();

        const endMark = `${name}-end`;
        this.performance.mark(endMark);
        this.endMarkedEvents.next(endMark);
    }

    /**
     * Observes measurement with the specified name and informs subscribers once it was ended.
     */
    observeMeasurement(name: string): Observable<number> {
        this.requireSupport();

        return new Observable<number>((observer: Subscriber<number>) => {
            const startMark = `${name}-start`;
            const endMark = `${name}-end`;
            let measured: boolean = false;

            const doMeasure = () => {
                if (this.performance.getEntriesByName(startMark).length && this.performance.getEntriesByName(endMark).length) {
                    this.performance.measure(name, startMark, endMark);
                    const mark = this.performance.getEntriesByName(name)[0]!;
                    observer.next(round(mark.duration));
                    measured = true;
                }
            };

            doMeasure();

            if (!measured) {
                observer.add(
                    this.endMarkedEvents.pipe(filter((e: any) => e === endMark)).subscribe(() => {
                        doMeasure();
                        if (!measured) {
                            observer.error(new Error(`Unable to measure timing for mark ${name}.`));
                        }
                    }),
                );
            }
        });
    }

    private requireSupport() {
        if (!this.isSupported) {
            throw new Error(
                'Performance is not supported on this device. Please check BrowserPerformanceService.isSupported before calling any performance methods.',
            );
        }
    }

    private getProfile(): LoadingProfile {
        const performanceEntries = this.performance.getEntriesByType('resource');
        const performanceTiming = this.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
            waterfall: this.getWaterfall(performanceEntries as PerformanceResourceTiming[], performanceTiming),
            network: performanceEntries as PerformanceResourceTiming[],
            events: this.getEventTimestamps(performanceTiming),
        };
    }

    private getWaterfall(performanceEntries: PerformanceResourceTiming[], performanceTiming: PerformanceNavigationTiming): LoadingWaterfall {
        const eventTimestamps = this.getEventTimestamps(performanceTiming);
        const assetsFetch = this.getAssetsTime(performanceEntries);
        const appCompilation = round(eventTimestamps.domContentLoadedEvent - assetsFetch, NaN);
        const appRun = round(eventTimestamps.loadEvent - appCompilation, NaN);

        return { assetsFetch, appCompilation, appRun };
    }

    private getEventTimestamps(performanceTiming: PerformanceNavigationTiming): EventTimestamps {
        return {
            domContentLoadedEvent: round(performanceTiming.domInteractive),
            loadEvent: round(performanceTiming.domComplete),
        };
    }

    private getAssetsTime(performanceEntries: PerformanceResourceTiming[]): number {
        const regexps = [
            /\/ClientDist\/app(\.\w+)?\.js/i,
            /\/ClientDist\/main(\.\w+)?\.js/i,
            /\/ClientDist\/vendor(\.\w+)?\.js/i,
            /\/ClientDist\/polyfills(\.\w+)?\.js/i,
            /\/*.(main|splash)(\.\w+)?\.css/i,
            /\/*.bundle(\.\w+)?\.css/i,
        ];

        const assetEntries = performanceEntries
            .filter((e: PerformanceResourceTiming) => regexps.some((rgx: RegExp) => rgx.test(e.name)))
            .sort((a: PerformanceResourceTiming, b: PerformanceResourceTiming) => b.responseEnd - a.responseEnd);

        if (assetEntries.length === 0) {
            this.log.warn('[BrowserPerformance] Unable to find any performance timings for app assets load. Were they deleted?');

            return NaN;
        }

        return round(assetEntries[0]!['responseEnd']);
    }
}
