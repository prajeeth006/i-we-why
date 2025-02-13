import { Injectable, inject } from '@angular/core';

import { Logger, OnFeatureInit, SpeculationService as SpeculationServiceCore, WINDOW } from '@frontend/vanilla/core';

import { SPECULATION_LOG_TAG, SpeculationService } from './speculation.service';

@Injectable()
export class SpeculationBootstrapService implements OnFeatureInit {
    private logger = inject(Logger);
    private speculationService = inject(SpeculationService);
    private speculationServiceCore = inject(SpeculationServiceCore);
    readonly #window = inject(WINDOW);

    onFeatureInit(): void {
        if (!this.isSpeculationRulesApiSupported()) {
            this.logger.warn(`${SPECULATION_LOG_TAG} Prerendering is disabled because the Speculation Rules API is not supported by this browser`);

            return;
        }

        this.speculationService._bootstrap();
        this.speculationServiceCore.set(this.speculationService);
    }

    isSpeculationRulesApiSupported(): boolean {
        return this.#window.HTMLScriptElement.supports && this.#window.HTMLScriptElement.supports('speculationrules');
    }
}
