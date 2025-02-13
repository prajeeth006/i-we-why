import { Mock, Stub } from 'moxxi';

import { InactivityScreenOverlayService } from '../src/inactivity-screen-overlay.service';

@Mock({ of: InactivityScreenOverlayService })
export class InactivityScreenOverlayServiceMock {
    @Stub() showCountdownOverlay: jasmine.Spy;
    @Stub() showSessionOverlay: jasmine.Spy;
}
