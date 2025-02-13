import { Injectable } from '@angular/core';

import { DebouncedAsyncDslResolver } from './debounced-async-dsl-resolver';
import { ListRequest, ListResponse } from './dsl.models';

@Injectable({
    providedIn: 'root',
})
export class DslListResolverService extends DebouncedAsyncDslResolver<ListRequest, ListResponse> {
    protected get refPrefix(): string {
        return 'list.Contains';
    }

    protected get endpoint(): string {
        return 'asyncdsl/list';
    }

    constructor() {
        super();
    }

    protected createCacheKey(request: ListRequest): string {
        return `${request.listName}.${request.item || ''}`;
    }
}
