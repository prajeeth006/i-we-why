import { Injectable } from '@angular/core';

import { CookieName, CookieService, DslService, SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';

import { ACCEPTED_STATUS } from './player-gaming-declaration-constants';
import { PlayerGamingDeclarationConfig } from './player-gaming-declaration.client-config';

export interface GamingDeclaration {
    status: string;
    acceptedDate?: Date;
}

@Injectable()
export class PlayerGamingDeclarationService {
    private gamingDeclarationEvents = new ReplaySubject<GamingDeclaration>(1);
    private loaded: boolean = false;

    get gamingDeclaration(): Observable<GamingDeclaration> {
        return this.gamingDeclarationEvents;
    }

    constructor(
        private api: SharedFeaturesApiService,
        private user: UserService,
        private cookieService: CookieService,
        private config: PlayerGamingDeclarationConfig,
        private dslService: DslService,
    ) {}

    /** @internal */
    load() {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;
            this.api.get('gamingdeclaration').subscribe((gamingDeclaration: GamingDeclaration) => {
                this.gamingDeclarationEvents.next(gamingDeclaration);
            });
        }
    }

    accept(status: {}) {
        return this.api.post('gamingdeclaration/accept', status);
    }

    setCookie() {
        this.cookieService.put(CookieName.GdAccepted, ACCEPTED_STATUS);
    }

    removeCookie() {
        this.cookieService.remove(CookieName.GdAccepted);
    }

    isAccepted() {
        return this.cookieService.get(CookieName.GdAccepted) == ACCEPTED_STATUS;
    }

    setReturnPath(url: string) {
        this.cookieService.put(CookieName.GdReturnPath, url);
    }

    removeReturnPath() {
        this.cookieService.remove(CookieName.GdReturnPath);
    }

    returnPath() {
        return this.cookieService.get(CookieName.GdReturnPath);
    }

    /** @description Gets the enablement status of the player gaming declaration. */
    async isEnabled(): Promise<boolean> {
        await firstValueFrom(this.config.whenReady);

        return await firstValueFrom(this.dslService.evaluateExpression<boolean>(this.config.isEnabledCondition));
    }
}
