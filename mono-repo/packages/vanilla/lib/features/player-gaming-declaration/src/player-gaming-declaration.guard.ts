import { inject } from '@angular/core';

import { UserService } from '@frontend/vanilla/core';

import { ACCEPTED_STATUS } from './player-gaming-declaration-constants';
import { PlayerGamingDeclarationService } from './player-gaming-declaration.service';

export const playerGamingDeclarationCanActivateGuard = async () => {
    const user = inject(UserService);
    const gamingDeclarationService = inject(PlayerGamingDeclarationService);
    const isEnabled = await gamingDeclarationService.isEnabled();

    if (
        !isEnabled ||
        !user.isAuthenticated ||
        user.gamingDeclarationFlag?.toUpperCase() == ACCEPTED_STATUS ||
        gamingDeclarationService.isAccepted()
    ) {
        return false;
    }

    return true;
};

export const playerGamingDeclarationCanDeactivateGuard = async () => {
    const user = inject(UserService);
    const gamingDeclarationService = inject(PlayerGamingDeclarationService);
    return user.gamingDeclarationFlag?.toUpperCase() == ACCEPTED_STATUS || gamingDeclarationService.isAccepted();
};
