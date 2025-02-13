import { Mock, Stub } from 'moxxi';

import { DslUserGroupAttributeResolverService } from '../../../../core/src/dsl/dsl-user-group-attribute-resolver.service';

@Mock({ of: DslUserGroupAttributeResolverService })
export class DslUserGroupAttributeResolverServiceMock {
    @Stub() resolve: jasmine.Spy;
}
