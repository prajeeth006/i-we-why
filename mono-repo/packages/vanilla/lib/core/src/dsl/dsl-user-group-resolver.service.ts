import { Injectable } from '@angular/core';

import { UserService } from '../user/user.service';
import { DebouncedAsyncDslResolver } from './debounced-async-dsl-resolver';
import { AsyncDslResponseBase } from './dsl.models';

export interface IsInGroupRequest {
    group: string;
}

export interface IsInGroupResponse extends IsInGroupRequest, AsyncDslResponseBase {}

@Injectable({
    providedIn: 'root',
})
export class DslUserGroupResolverService extends DebouncedAsyncDslResolver<IsInGroupRequest, IsInGroupResponse> {
    constructor(private user: UserService) {
        super();
    }

    protected get refPrefix(): string {
        return 'user.IsInGroup';
    }

    protected get endpoint(): string {
        return 'asyncdsl/group';
    }

    protected createCacheKey(request: IsInGroupRequest): string {
        return `${request.group}.${this.user.username}`;
    }
}
