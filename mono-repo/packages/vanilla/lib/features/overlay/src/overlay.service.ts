import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class OverlayService {
    private currentlyActiveHandler: OverlayHandler | null;
    private activeHandlerEvents = new BehaviorSubject<OverlayHandler | null>(null);
    /**
     * @internal
     */
    get activeHandler(): Observable<OverlayHandler | null> {
        return this.activeHandlerEvents;
    }

    /** An observable that reports overall status of the overlay (whether it is shown or not). */
    get active(): Observable<boolean> {
        return this.activeHandlerEvents.pipe(map((h) => !!h));
    }

    /** An returns true if overlay is currently shown, otherwise false. */
    get isActive(): boolean {
        return this.currentlyActiveHandler != null;
    }

    constructor() {
        this.activeHandler.subscribe((handler) => (this.currentlyActiveHandler = handler));
    }

    /**
     * Gets a handler that can show or hide the overlay.
     */
    getHandler(options?: OverlayOptions): OverlayHandler {
        const handler = new OverlayHandler(options);

        handler.activate.subscribe((activate: boolean) => {
            if (activate) {
                if (this.currentlyActiveHandler && this.currentlyActiveHandler !== handler) {
                    throw new Error('Another overlay is already displayed');
                }

                this.activeHandlerEvents.next(handler);
            } else {
                if (this.currentlyActiveHandler === handler) {
                    this.activeHandlerEvents.next(null);
                }
            }
        });

        return handler;
    }
}

/**
 * @whatItDoes Handler returned by {@link OverlayService} to control the main overlay.
 *
 * @stable
 */
export class OverlayHandler {
    private activateEvents: Subject<boolean> = new Subject();

    get activate(): Observable<boolean> {
        return this.activateEvents;
    }

    /**
     * @internal
     */
    constructor(options?: OverlayOptions) {
        options = options || <OverlayOptions>{};

        if (options.onClick) {
            this.onClick = options.onClick;
        }
    }

    /**
     * @internal
     */
    onClick: () => boolean | void = () => true;

    /**
     * Shows the overlay. If an overlay is already active, it throws an error.
     */
    show(): void {
        this.activateEvents.next(true);
    }

    /**
     * Hides the overlay if it's the currently shown one.
     */
    hide(): void {
        this.activateEvents.next(false);
    }

    /**
     * Calls `show()` or `hide()` based on the parameter `value`.
     */
    toggle(value: boolean) {
        if (value) {
            this.show();
        } else {
            this.hide();
        }
    }
}

/**
 * Options for overlay handler.
 *
 * @stable
 */
export interface OverlayOptions {
    /**
     * A callback that is called when overlay is clicked. If it returns true, the overlay
     * stays open after click. Otherwise it's closed.
     */
    onClick?: () => boolean | void;
}
