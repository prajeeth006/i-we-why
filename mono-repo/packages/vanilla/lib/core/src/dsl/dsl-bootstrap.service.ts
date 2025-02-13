import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { vanillaAppExport } from '../utils/vanilla-app-export';
import { DslEnvService } from './dsl-env.service';
import { DslConfig } from './dsl.client-config';
import { DslEnvExecutionMode } from './dsl.models';

@Injectable()
export class DslBootstrapService implements OnAppInit {
    constructor(
        private dslEnvService: DslEnvService,
        private dslConfig: DslConfig,
    ) {}

    onAppInit() {
        this.dslEnvService.registerDefaultValuesNotReadyDslProviders(this.dslConfig.defaultValuesUnregisteredProvider);

        vanillaAppExport('diagnostics', 'evaluateDsl', (expression: string) => {
            return this.dslEnvService.run(expression);
        });

        vanillaAppExport('diagnostics', 'executeDsa', (action: string) => {
            return this.dslEnvService.run(action, DslEnvExecutionMode.Action);
        });
    }
}
