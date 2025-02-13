import { MediaQueryService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: MediaQueryService })
export class MediaQueryServiceMock {
    @StubObservable() observe: jasmine.ObservableSpy;
    @Stub() isActive: jasmine.Spy;
}
