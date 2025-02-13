import { Injectable, inject } from '@angular/core';

import { OnFeatureInit, TimerService, WINDOW } from '@frontend/vanilla/core';

import { PrerenderConfig } from './prerender.client-config';

@Injectable()
export class PrerenderBootstrapService implements OnFeatureInit {
    readonly #window = inject(WINDOW);

    private get prerenderReady() {
        return this.#window['prerenderReady'];
    }

    private set prerenderReady(value: boolean) {
        this.#window['prerenderReady'] = value;
    }

    private get authRequired() {
        return this.#window['vnAuthRequired'];
    }

    constructor(
        private config: PrerenderConfig,

        private timerService: TimerService,
    ) {}

    onFeatureInit() {
        this.#window['vnPrerenderStatus'] = () => this.getPrerenderStatus(); // do this ASAP even if config is not ready
        this.config.whenReady.subscribe(() => {
            if (this.prerenderReady === true) {
                return;
            }

            this.timerService.setTimeout(() => {
                this.prerenderReady = true;
            }, this.config.maxWaitingTime);
        });
    }

    private getPrerenderStatus(): number {
        if (this.authRequired) return 1; // auth required
        if (this.prerenderReady) return 2; // prerender ready
        return 0; // not ready
    }
}
