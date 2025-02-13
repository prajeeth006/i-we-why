import { Mock, Stub } from 'moxxi';

import { ClipboardService } from '../src/clipboard.service';

@Mock({ of: ClipboardService })
export class ClipboardServiceMock {
    @Stub() copy: jasmine.Spy;
}
