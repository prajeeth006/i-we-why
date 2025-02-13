import { Injectable } from '@angular/core';

import { DslListResolverService } from '../dsl-list-resolver.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class ListDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private dslListResolverService: DslListResolverService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            List: this.dslRecorderService.createRecordable('list').createFunction({
                name: 'Contains',
                get: (listName: string, item: string) => this.dslListResolverService.resolve({ listName, item })?.passed,
                deps: [{ key: 'list.Contains', args: 2 }],
            }),
        };
    }
}
