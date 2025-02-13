import { Mock, Stub } from 'moxxi';

import { PlayerActiveWagerOverlayService } from '../src/player-active-wager-overlay.service';

@Mock({ of: PlayerActiveWagerOverlayService })
export class PlayerActiveWagerOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}
