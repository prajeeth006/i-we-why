import { DslValueAsyncResolver } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DslValueAsyncResolver })
export class DslValueAsyncResolverMock {
    @Stub() resolve: jasmine.Spy;
}
