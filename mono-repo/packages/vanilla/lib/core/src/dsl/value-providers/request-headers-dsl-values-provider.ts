import { Injectable, inject } from '@angular/core';

import { WINDOW } from '../../browser/window/window.token';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class RequestHeadersDslValuesProvider implements DslValuesProvider {
    readonly #window = inject(WINDOW);

    constructor(private dslRecorderService: DslRecorderService) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            RequestHeaders: this.dslRecorderService.createRecordable('requestHeaders').createProperty({
                name: 'UserAgent',
                get: () => this.#window.navigator.userAgent,
                deps: [],
            }),
        };
    }
}
