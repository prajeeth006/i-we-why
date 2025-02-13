import { Injectable } from '@angular/core';

import { Page } from '../../client-config/page.client-config';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class EpcotDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private page: Page,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Epcot: this.dslRecorderService.createRecordable('epcot').createFunction({
                name: 'IsEnabled',
                get: (featureName: string) => {
                    switch (featureName?.toLowerCase()) {
                        case 'accountmenu':
                            return this.page.epcot.accountMenuVersion === 4;
                        case 'header':
                            return this.page.epcot.headerVersion === 2;
                        default:
                            return false;
                    }
                },
                deps: ['user.isAuthenticated'],
            }),
        };
    }
}
