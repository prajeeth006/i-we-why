import { PageService, RevertiblePageChange } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: PageService })
export class PageServiceMock {
    @Stub() setTitle: jasmine.Spy;
    @Stub() setMeta: jasmine.Spy;
}

export class RevertiblePageChangeMock implements RevertiblePageChange {
    @Stub() write: jasmine.Spy;
    @Stub() revert: jasmine.Spy;
}
