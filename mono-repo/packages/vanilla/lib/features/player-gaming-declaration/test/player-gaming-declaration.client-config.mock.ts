import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { PlayerGamingDeclarationConfig } from '../src/player-gaming-declaration.client-config';

@Mock({ of: PlayerGamingDeclarationConfig })
export class PlayerGamingDeclarationConfigMock extends PlayerGamingDeclarationConfig {
    override whenReady: Subject<void> = new Subject();
}
