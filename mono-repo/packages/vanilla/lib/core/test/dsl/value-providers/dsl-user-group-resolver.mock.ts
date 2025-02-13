import { Mock, Stub } from 'moxxi';

import { DslUserGroupResolverService } from '../../../../core/src/dsl/dsl-user-group-resolver.service';

@Mock({ of: DslUserGroupResolverService })
export class DslUserGroupResolverServiceMock {
    @Stub() resolve: jasmine.Spy;
}
