import { Injectable, inject } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { WindowEvent } from '../browser/window/window-ref.service';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { RemoteLogger, defaultRemoteLogger } from './remote-logger';

@Injectable()
export class LoggingBootstrapService implements OnAppInit {
    readonly #window = inject(WINDOW);

    constructor(private page: Page) {}

    onAppInit() {
        const loggingConfig = this.page.logging;
        const disableLogLevels: { [key: string]: RegExp | null } = {};
        if (loggingConfig.disableLogLevels)
            Object.entries(loggingConfig.disableLogLevels).forEach(([key, value]) => {
                disableLogLevels[key.toLowerCase()] = value ? new RegExp(value.pattern) : null;
            });

        RemoteLogger.configure({
            isEnabled: loggingConfig.isEnabled,
            url: '/log',
            debounceInterval: loggingConfig.debounceInterval,
            maxErrorsPerBatch: loggingConfig.maxErrorsPerBatch,
            disableLogLevels: disableLogLevels,
        });
        this.#window.addEventListener(WindowEvent.BeforeUnload, () => defaultRemoteLogger.sendLogsWithBeacon(), false);
    }
}
