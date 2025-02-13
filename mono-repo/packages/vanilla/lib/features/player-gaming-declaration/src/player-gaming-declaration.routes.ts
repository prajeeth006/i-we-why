import { Routes } from '@angular/router';

import { PlayerGamingDeclarationComponent } from './player-gaming-declaration.component';
import { provide } from './player-gaming-declaration.feature';
import { playerGamingDeclarationCanActivateGuard, playerGamingDeclarationCanDeactivateGuard } from './player-gaming-declaration.guard';
import { playerGamingDeclarationResolver } from './player-gaming-declaration.resolver';

export const ROUTES: Routes = [
    {
        path: '',
        component: PlayerGamingDeclarationComponent,
        resolve: {
            initData: playerGamingDeclarationResolver,
        },
        canActivate: [playerGamingDeclarationCanActivateGuard],
        canDeactivate: [playerGamingDeclarationCanDeactivateGuard],
        providers: provide(),
    },
];
