import { Mock, Stub } from 'moxxi';

import { ContentMessagesTrackingService } from '../src/content-messages-tracking.service';

@Mock({ of: ContentMessagesTrackingService })
export class ContentMessagesTrackingServiceMock {
    @Stub() trackMessageLoaded: jasmine.Spy;
    @Stub() trackMessageClosed: jasmine.Spy;
}
