import { Injectable, inject } from '@angular/core';

import { Page, WINDOW } from '@frontend/vanilla/core';
import { Observable, ObservableInput, Subject, fromEvent, interval, merge } from 'rxjs';
import { multicast, refCount, switchMap } from 'rxjs/operators';

/**
 * Additional options for {@link IdleService}
 *
 * @experimental
 */
export interface IdleOptions {
    /**
     * Additional event that will be used for idle check.
     */
    additionalActivityEvent?: ObservableInput<any>;
    /**
     * Whether to start to watch for idle after the first activity. If true, it will wait for the first activity and then start check for idle.
     */
    watchForIdleAfterFirstActivity?: boolean;
}

/**
 * @whatItDoes Provides information about the user idle time.
 *
 * @howToUse
 *
 * ```
 * idleService.whenIdle(5000).subscribe(() => {});
 * ```
 *
 * @description
 *
 * # Overview
 *
 * This service is meant to be used for detecting user idle where idle means activity on the screen (click, keypress).
 *  - Setup listener on DOM events for checking user activity
 *  - Returns if a user is idle for some period of time, based on provided timeout in milliseconds
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class IdleService {
    /**
     * Detect DOM events, click, keypress
     *
     * @stable
     */
    get activity(): Observable<Event> {
        return this.activityEvents;
    }

    private activityEvents: Observable<Event>;
    readonly #window = inject(WINDOW);

    constructor(private page: Page) {
        this.init(this.page.idleModeCaptureEnabled);
    }

    /**
     *  Detect user activity based on the DOM events.
     */
    private init(capture: boolean) {
        if (!this.activityEvents) {
            this.activityEvents = merge(
                fromEvent(this.#window, 'click', {
                    capture,
                }),
                fromEvent(this.#window, 'keypress', {
                    capture,
                }),
            );
        }
    }

    /**
     * Detect if user is inactive for provided period of time.
     * @param timeout timeout in milliseconds
     * @param options optional idle options: {@link IdleOptions}
     *
     * @stable
     */
    whenIdle(timeout: number, options?: IdleOptions): Observable<void> {
        const idleSubject: Subject<void> = new Subject<void>();
        // NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
        const source = new Observable<void>((observer) => {
            const watchForIdleImmediately: Subject<void> = new Subject<void>();
            const activity = options?.additionalActivityEvent
                ? merge(this.activityEvents, options.additionalActivityEvent, watchForIdleImmediately)
                : merge(this.activityEvents, watchForIdleImmediately);
            observer.add(activity.pipe(switchMap(() => interval(timeout))).subscribe(() => observer.next()));

            if (!options?.watchForIdleAfterFirstActivity) {
                watchForIdleImmediately.next();
            }
        });

        return source.pipe(multicast(idleSubject), refCount());
    }
}
