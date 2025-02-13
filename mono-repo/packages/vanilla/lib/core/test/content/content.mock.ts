import { ContentService } from '@frontend/vanilla/core';
import { Mock, StubObservable } from 'moxxi';

@Mock({ of: ContentService })
export class ContentServiceMock {
    @StubObservable() getJson: jasmine.ObservableSpy;
    @StubObservable() getJsonFiltered: jasmine.ObservableSpy;
}
