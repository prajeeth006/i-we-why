import { Injectable, inject, signal } from '@angular/core';

import { HtmlNode } from '../browser/html-node.service';
import { TimerService } from '../browser/timer.service';
import { Page } from '../client-config/page.client-config';
import { LoadingIndicatorHandler } from './loading-indicator-handler';
import { LoadingIndicatorOptions } from './loading-indicator.models';

/**
 * @whatItDoes Controls the global loading indicator
 *
 * @howToUse
 *
 * ```
 * var loadingIndicator = LoadingIndicatorService.start();
 *
 * loadingIndicator.done();
 * ```
 *
 * @description
 *
 * This service controls when to show and hide the global loading indicator.
 *
 * To close, same number of `done` calls is required as then number of `start` calls.
 * You can only call `done` once on each instance created by `start`.
 *
 * Optionally you can specify delay before the timer is shown (default is 250ms).
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoadingIndicatorService {
    readonly visible = signal<boolean>(false);

    private counter: number = 0;
    private blockScrollCounter: number = 0;
    private readonly disabledUrlPattern: RegExp;
    private readonly defaultOptions: LoadingIndicatorOptions;
    private timerService = inject(TimerService);
    constructor(
        private htmlNode: HtmlNode,
        page: Page,
    ) {
        this.defaultOptions = { delay: page.loadingIndicator.defaultDelay };
        this.disabledUrlPattern = new RegExp(page.loadingIndicator.disabledUrlPattern ?? '(?!)', 'i');
    }

    start(options?: LoadingIndicatorOptions): LoadingIndicatorHandler {
        const opts = Object.assign({}, this.defaultOptions, options);

        this.counter++;

        if (opts.blockScrolling) {
            this.blockScrollCounter++;
            this.htmlNode.blockScrolling(true);
        }

        if (opts.disabled === undefined && opts?.url) {
            opts.disabled = this.disabledUrlPattern && this.disabledUrlPattern.test(opts.url);
        }

        const handler = new LoadingIndicatorHandler(this.timerService, opts);

        handler.show.subscribe((isVisible: boolean) => {
            if (isVisible) {
                this.visible.set(isVisible);
            } else {
                this.counter--;

                if (this.blockScrollCounter) {
                    this.blockScrollCounter--;
                }

                if (this.counter === 0) {
                    this.visible.set(isVisible);
                }

                if (opts.blockScrolling && this.blockScrollCounter === 0) {
                    this.htmlNode.blockScrolling(false);
                }
            }
        });

        return handler;
    }
}
