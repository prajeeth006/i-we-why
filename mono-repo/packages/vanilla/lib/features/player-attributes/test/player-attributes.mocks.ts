import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { PlayerAttributes } from '../src/player-attributes.models';
import { PlayerAttributesService } from '../src/player-attributes.service';

@Mock({ of: PlayerAttributesService })
export class PlayerAttributesServiceMock {
    playerAttributes = new Subject<PlayerAttributes>();
    @Stub() refresh: jasmine.Spy;
}
