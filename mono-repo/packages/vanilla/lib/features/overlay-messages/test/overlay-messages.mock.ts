import { Mock, Stub } from 'moxxi';

import { OverlayMessagesService } from '../src/overlay-messages.service';

@Mock({ of: OverlayMessagesService })
export class OverlayMessagesServiceMock {
    @Stub() showOverlayMessages: jasmine.Spy;
}
