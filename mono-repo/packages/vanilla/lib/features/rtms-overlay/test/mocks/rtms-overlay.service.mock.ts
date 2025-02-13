import { Mock, Stub } from 'moxxi';

import { RtmsOverlayService } from '../../src/rtms-overlay.service';

@Mock({ of: RtmsOverlayService })
export class RtmsOverlayServiceMock {
    @Stub() init: jasmine.Spy;
}
