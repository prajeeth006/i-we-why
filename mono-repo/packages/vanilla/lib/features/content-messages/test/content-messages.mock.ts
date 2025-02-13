import { Mock, Stub, StubObservable } from 'moxxi';

import { ContentMessagesService } from '../src/content-messages.service';

@Mock({ of: ContentMessagesService })
export class ContentMessagesServiceMock {
    @StubObservable() getMessages: jasmine.ObservableSpy;
    @Stub() getClosedMessageNames: jasmine.Spy;
    @Stub() markMessageAsClosed: jasmine.Spy;
}
