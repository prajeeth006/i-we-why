import { Mock, Stub } from 'moxxi';

import { DslListResolverService } from '../../../../core/src/dsl/dsl-list-resolver.service';

@Mock({ of: DslListResolverService })
export class DslListResolverServiceMock {
    @Stub() resolve: jasmine.Spy;
}
