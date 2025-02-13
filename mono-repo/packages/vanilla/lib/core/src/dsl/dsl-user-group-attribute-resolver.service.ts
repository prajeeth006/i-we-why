import { Injectable } from '@angular/core';

import { UserService } from '../user/user.service';
import { DebouncedAsyncDslResolver } from './debounced-async-dsl-resolver';
import { GetGroupAttributeRequest, GetGroupAttributeResponse } from './dsl.models';

@Injectable({
    providedIn: 'root',
})
export class DslUserGroupAttributeResolverService extends DebouncedAsyncDslResolver<GetGroupAttributeRequest, GetGroupAttributeResponse> {
    constructor(private user: UserService) {
        super();
    }

    protected get refPrefix(): string {
        return 'user.GetGroupAttribute';
    }

    protected get endpoint(): string {
        return 'asyncdsl/groupattribute';
    }

    protected createCacheKey(request: GetGroupAttributeRequest): string {
        return `${request.groupName}.${request.groupAttribute}.${this.user.username}`;
    }
}
