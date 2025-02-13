import { Observable, Subject } from 'rxjs';

import { TimerService } from '../core';
import { LoadingIndicatorOptions } from './loading-indicator.models';

/**
 * Handler for closing loading indicator returned by {@link LoadingIndicatorService}.
 *
 * @stable
 */
export class LoadingIndicatorHandler {
    get show(): Observable<boolean> {
        return this.showEvents;
    }

    private readonly showEvents = new Subject<boolean>();

    private readonly timeoutId: NodeJS.Timeout;
    /**
     * @internal
     */
    constructor(
        private timerService: TimerService,
        options: LoadingIndicatorOptions,
    ) {
        if (!options.disabled) {
            this.timeoutId = this.timerService.setTimeout(() => this.showEvents.next(true), options.delay);
        }
    }

    done() {
        this.timerService.clearTimeout(this.timeoutId);
        this.showEvents.next(false);
    }
}
