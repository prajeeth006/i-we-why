/* eslint-disable deprecation/deprecation */
import { Injectable, Injector, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceService, NavigationService, WINDOW, WindowEvent } from '@frontend/vanilla/core';
import { Observable, fromEvent, interval, merge, startWith } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

const eventQueueKey = '_ptEventsQueue';

@Injectable({
    providedIn: 'root',
})
export class PartytownService {
    private deviceService = inject(DeviceService);
    private injector = inject(Injector);
    private navigationService = inject(NavigationService);
    // private cookieService = inject(CookieService);
    private router = inject(Router);
    readonly #window = inject(WINDOW);
    private document = this.#window.document;
    private navigator = this.#window.navigator;
    private performance = this.#window.performance;

    private readonly ptSharedStorage: {
        set: (key: string, value: any) => void;
    };

    private readonly ptWorkerLocation: {
        set: (location: Location) => void;
    };

    constructor() {
        this.ptWorkerLocation = this.#window.ptWorkerLocation = this.#window.ptWorkerLocation ?? {
            set: () => {},
        };
        this.ptSharedStorage = this.#window.ptSharedStorage = this.#window.ptSharedStorage ?? {
            set: () => {},
        };
    }

    createEventReplayQueue() {
        const dataLayer = this.#window.dataLayer || [];
        replayEvents(dataLayer);
        const origPush = dataLayer.push;

        dataLayer.push = (...args: any) => {
            addToQueue(JSON.stringify(args));
            return origPush.apply(dataLayer, args);
        };
    }

    createSharedStorage() {
        this.setStaticProps();

        this.createDimensionsEffect();

        this.subscribeToDynamicProps();
    }

    private getWindowOffsetUpdates() {
        return fromEvent(this.#window, 'scroll').pipe(debounceTime(1000));
    }

    private getVisibilityUpdates() {
        return new Observable((observer) => {
            const handler = () => observer.next(document.hidden);

            this.#window.addEventListener(WindowEvent.VisibilityChange, handler);

            return () => this.#window.removeEventListener(WindowEvent.VisibilityChange, handler);
        });
    }

    private setStaticProps() {
        // window props
        this.ptSharedStorage.set('window.opener', this.#window.opener);

        // document props
        this.ptSharedStorage.set('document.characterSet', this.document.characterSet);
        this.ptSharedStorage.set('document.referrer', this.document.referrer);
        this.ptSharedStorage.set('document.domain', this.document.domain);
        this.ptSharedStorage.set('document.prerendering', (this.document as any).prerendering);

        // navigator props
        this.ptSharedStorage.set('window.navigator.loadPurpose', (this.navigator as any).loadPurpose);
        this.ptSharedStorage.set('window.navigator.userLanguage', (this.navigator as any).userLanguage);
        this.ptSharedStorage.set('window.navigator.cookieEnabled', this.navigator.cookieEnabled);
        this.ptSharedStorage.set('window.navigator.cookieDeprecationLabel', (this.navigator as any).cookieDeprecationLabel);
        this.ptSharedStorage.set('window.navigator.vendor', this.navigator.vendor);
        this.ptSharedStorage.set('window.navigator.doNotTrack', this.navigator.doNotTrack);
        this.ptSharedStorage.set('window.navigator.maxTouchPoints', this.navigator.maxTouchPoints);
        this.ptSharedStorage.set('window.navigator.msDoNotTrack', (this.navigator as any)['msDoNotTrack']);

        // perf timings
        this.ptSharedStorage.set('performance.timeOrigin', this.performance.timeOrigin);
        this.ptSharedStorage.set('performancetiming.navigationStart', this.performance.timing.navigationStart);
        this.ptSharedStorage.set('performancetiming.redirectStart', this.performance.timing.redirectStart);
        this.ptSharedStorage.set('performancetiming.redirectEnd', this.performance.timing.redirectEnd);
        this.ptSharedStorage.set('performancetiming.fetchStart', this.performance.timing.fetchStart);
        this.ptSharedStorage.set('performancetiming.domainLookupStart', this.performance.timing.domainLookupStart);
        this.ptSharedStorage.set('performancetiming.domainLookupEnd', this.performance.timing.domainLookupEnd);
        this.ptSharedStorage.set('performancetiming.connectStart', this.performance.timing.connectStart);
        this.ptSharedStorage.set('performancetiming.secureConnectionStart', this.performance.timing.secureConnectionStart);
        this.ptSharedStorage.set('performancetiming.connectEnd', this.performance.timing.connectEnd);
        this.ptSharedStorage.set('performancetiming.requestStart', this.performance.timing.requestStart);
        this.ptSharedStorage.set('performancetiming.responseStart', this.performance.timing.responseStart);
        this.ptSharedStorage.set('performancetiming.responseEnd', this.performance.timing.responseEnd);
        this.ptSharedStorage.set('performancetiming.unloadEventStart', this.performance.timing.unloadEventStart);
        this.ptSharedStorage.set('performancetiming.unloadEventEnd', this.performance.timing.unloadEventEnd);
        this.ptSharedStorage.set('performancetiming.domLoading', this.performance.timing.domLoading);
        this.ptSharedStorage.set('performancetiming.domInteractive', this.performance.timing.domInteractive);
        this.ptSharedStorage.set('performancetiming.domContentLoadedEventStart', this.performance.timing.domContentLoadedEventStart);
        this.ptSharedStorage.set('performancetiming.domContentLoadedEventEnd', this.performance.timing.domContentLoadedEventEnd);
        this.ptSharedStorage.set('performancetiming.domComplete', this.performance.timing.domComplete);
        this.ptSharedStorage.set('performancetiming.loadEventStart', this.performance.timing.loadEventStart);
        this.ptSharedStorage.set('performancetiming.loadEventEnd', this.performance.timing.loadEventEnd);
    }

    private createDimensionsEffect() {
        effect(
            () => {
                const windowRect = this.deviceService.windowRect();
                const screenHeight = this.deviceService.visualViewportHeight();
                const screenWidth = this.deviceService.visualViewportWidth();

                // dimensions
                this.ptSharedStorage.set('screen.width', screenWidth);
                this.ptSharedStorage.set('screen.colorDepth', screen.colorDepth);
                this.ptSharedStorage.set('html.clientWidth', windowRect.width);
                this.ptSharedStorage.set('html.innerWidth', screenWidth);
                this.ptSharedStorage.set('html.scrollWidth', windowRect.width);
                this.ptSharedStorage.set('html.offsetWidth', windowRect.width);
                this.ptSharedStorage.set('html.offsetHeight', windowRect.height);
                this.ptSharedStorage.set('screen.height', screenHeight);
                this.ptSharedStorage.set('body.offsetHeight', windowRect.height);
                this.ptSharedStorage.set('body.scrollHeight', windowRect.height);
                this.ptSharedStorage.set('html.clientHeight', screenHeight);
                this.ptSharedStorage.set('html.innerHeight', screenHeight);
                this.ptSharedStorage.set('html.scrollHeight', windowRect.height);
                this.ptSharedStorage.set('window.innerWidth', windowRect.width);
                this.ptSharedStorage.set('window.innerHeight', windowRect.height);
            },
            { injector: this.injector },
        );
    }

    private subscribeToDynamicProps() {
        this.navigationService.locationChange
            .pipe(
                switchMap(() =>
                    merge(
                        // whenever queryParams change, update the route
                        this.router.routerState.root.queryParamMap.pipe(startWith(this.router.routerState.root.snapshot.queryParamMap)),
                        // We have to do polling here, as the angular router doesn't send us ANY
                        // information that e.g. ?tab=score or ?market=5 changed
                        // for the current hotfix state this is fine!
                        interval(2500),
                    ),
                ),
                startWith(true),
                map(() => this.#window.location.href),
                distinctUntilChanged(),
            )
            .subscribe(() => {
                this.ptWorkerLocation.set(this.#window.location);
                this.ptSharedStorage.set('document.title', document.title);
                this.ptSharedStorage.set('window.location', this.#window.location);
            });

        // ToDo: fix duplicated cookies issue to uncomment
        // this.cookieService
        //     .getCookieUpdates()
        //     .pipe(debounceTime(100), startWith(document.cookie))
        //     .subscribe((value) => this.ptSharedStorage.set('document.cookie', value));

        this.getVisibilityUpdates()
            .pipe(startWith(document.hidden))
            .subscribe((value) => this.ptSharedStorage.set('document.hidden', value));

        this.getWindowOffsetUpdates()
            .pipe(startWith(true))
            .subscribe(() => {
                this.ptSharedStorage.set('window.pageYOffset', this.#window.pageYOffset);
                this.ptSharedStorage.set('window.scrollY', this.#window.scrollY);
            });

        this.getSnowplowCounterUpdates()
            .pipe(startWith(true))
            .subscribe(() => {
                this.ptSharedStorage.set('window.i', this.#window.i);
            });
    }

    private getSnowplowCounterUpdates() {
        const nativeWindow = this.#window;
        nativeWindow._i = nativeWindow.i;

        return new Observable<number>((observer) => {
            Object.defineProperty(this.#window, 'i', {
                enumerable: true,
                configurable: true,
                get() {
                    return nativeWindow._i;
                },
                set(value) {
                    nativeWindow._i = value;
                    observer.next(value);
                },
            });
        });
    }
}

const getEventsQueue = (): string[] => {
    try {
        const savedEventsItem = localStorage.getItem(eventQueueKey);
        return savedEventsItem ? JSON.parse(savedEventsItem) : [];
    } catch (e) {
        console.error('Failed to parse events queue:', e);
        return [];
    }
};

const addToQueue = (event: string) => {
    try {
        const eventsQueue = getEventsQueue();
        eventsQueue.push(event);
        localStorage.setItem(eventQueueKey, JSON.stringify(eventsQueue));
    } catch (e) {
        console.error('Failed to store event in a queue:', e);
    }
};

const replayEvents = (dataLayer: unknown[]) => {
    try {
        const eventsQueue = getEventsQueue();

        eventsQueue.forEach((event) => {
            const parsedArgs = JSON.parse(event);
            dataLayer.push(...parsedArgs);
        });
    } catch (e) {
        console.error('Failed to restore events:', e);
    }

    localStorage.removeItem(eventQueueKey);
};
