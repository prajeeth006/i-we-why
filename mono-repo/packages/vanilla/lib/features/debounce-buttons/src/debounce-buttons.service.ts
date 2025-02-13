import { Injectable, OnDestroy, inject } from '@angular/core';

import { DslService, WINDOW, WebWorkerService, WindowEvent, WorkerType } from '@frontend/vanilla/core';

export interface DebounceButtonConfig {
    debounceTime?: string;
    disabledClass?: string;
    disabledCondition?: string;
    selector?: string;
}

@Injectable({
    providedIn: 'root',
})
export class DebounceButtonsService implements OnDestroy {
    readonly #window = inject(WINDOW);

    constructor(
        private dslService: DslService,
        private webWorkerService: WebWorkerService,
    ) {}

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.DebounceButtonsTimeout);
    }

    init(config: DebounceButtonConfig) {
        if (!config.selector) {
            return;
        }

        const elements = this.#window.document.querySelectorAll(config.selector);

        elements?.forEach((element: Element) => {
            if (config.disabledCondition) {
                this.dslService.evaluateExpression<boolean>(config.disabledCondition).subscribe((isDisabled: boolean) => {
                    if (isDisabled) {
                        element.classList.add(config.disabledClass || 'disabled');
                    } else {
                        this.addClickHandler(element, config);
                    }
                });
            } else {
                this.addClickHandler(element, config);
            }
        });
    }

    private addClickHandler(element: Element, config: DebounceButtonConfig) {
        element.addEventListener(WindowEvent.Click, () => {
            const disabledClass = config?.disabledClass || 'disabled';

            if (!element.classList.contains(disabledClass)) {
                element.classList.add(disabledClass);

                this.webWorkerService.createWorker(WorkerType.DebounceButtonsTimeout, { timeout: Number(config.debounceTime) }, () => {
                    if (config.selector && element.classList.contains(config.selector)) {
                        element.classList.remove(disabledClass);
                    }

                    this.webWorkerService.removeWorker(WorkerType.DebounceButtonsTimeout);
                });
            }
        });
    }
}
