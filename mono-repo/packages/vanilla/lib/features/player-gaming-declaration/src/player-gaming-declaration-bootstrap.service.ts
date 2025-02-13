import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { NativeAppService, NavigationService, OnFeatureInit, UserService } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { ACCEPTED_STATUS, GAMING_DECLARATION_PATH, NOT_ACCEPTED_STATUS } from './player-gaming-declaration-constants';
import { PlayerGamingDeclarationService } from './player-gaming-declaration.service';

@Injectable()
export class PlayerGamingDeclarationBootstrapService implements OnFeatureInit {
    constructor(
        private gamingDeclarationService: PlayerGamingDeclarationService,
        private user: UserService,
        private navigationService: NavigationService,
        private nativeApp: NativeAppService,
        private router: Router,
    ) {}

    async onFeatureInit() {
        const isEnabled = await this.gamingDeclarationService.isEnabled();

        if (!isEnabled) {
            return;
        }

        this.router.events.pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized)).subscribe((e: RoutesRecognized) => {
            if (e.url.includes('gaming-declaration')) {
                this.nativeApp.sendToNative({ eventName: 'hideCloseButton' });
            }
        });

        if (
            this.user.isFirstLogin ||
            this.user.gamingDeclarationFlag?.toUpperCase() == ACCEPTED_STATUS ||
            this.gamingDeclarationService.isAccepted()
        ) {
            return;
        }

        this.gamingDeclarationService.gamingDeclaration.subscribe((gamingDeclaration) => {
            // Platform will send Y|N for Austrian users and null to non Austrian users so this makes sure redirect happens only for Austrian users that did not accept yet.
            if (gamingDeclaration?.status?.toUpperCase() === NOT_ACCEPTED_STATUS) {
                this.gamingDeclarationService.setReturnPath(this.navigationService.location.absUrl());
                this.navigationService.goTo(GAMING_DECLARATION_PATH);
            } else {
                this.gamingDeclarationService.removeCookie();
            }
        });

        if (this.user.isAuthenticated) {
            this.gamingDeclarationService.load();
        }
    }
}
