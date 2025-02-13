import { inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { PlayerGamingDeclarationConfig } from './player-gaming-declaration.client-config';

export const playerGamingDeclarationResolver = () => {
    const config = inject(PlayerGamingDeclarationConfig);
    return config.whenReady.pipe(map(() => config.content));
};
