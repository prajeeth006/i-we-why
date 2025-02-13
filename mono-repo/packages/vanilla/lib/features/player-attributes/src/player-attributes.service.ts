import { Injectable, inject } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PlayerAttributes } from './player-attributes.models';

/**
 * @whatItDoes Provides player attributes.
 *
 * @description
 *
 * This service is used to get and refresh player attributes.
 *
 * @stable
 *
 */
@Injectable({
    providedIn: 'root',
})
export class PlayerAttributesService {
    private sharedFeaturesApiService = inject(SharedFeaturesApiService);
    private userService = inject(UserService);

    private playerAttributesEvents = new BehaviorSubject<PlayerAttributes | null>(null);
    private loaded: boolean;

    /**
     * Allows to subscribe to player attributes.
     */
    get playerAttributes(): Observable<PlayerAttributes | null> {
        this.load();

        return this.playerAttributesEvents;
    }

    /**
     * Refreshes the player attributes.
     *
     * @param cached - If true, the cached data will be used.
     */
    refresh(cached = true) {
        this.loaded = false;
        this.load(cached);
    }

    private load(cached = true) {
        if (this.userService.isAuthenticated && !this.loaded) {
            this.loaded = true;

            this.sharedFeaturesApiService
                .get('playerAttributes', { cached })
                .subscribe((response: PlayerAttributes) => this.playerAttributesEvents.next(response));
        }
    }
}
