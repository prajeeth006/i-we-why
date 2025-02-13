import { Injectable } from '@angular/core';

import {
    DSL_NOT_READY,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    EventsService,
    UserService,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { distinctUntilChanged } from 'rxjs';

import { CoinsBalance, GamificationService } from './gamification.service';

@Injectable()
export class GamificationDslValuesProvider implements DslValuesProvider {
    private balance: CoinsBalance | null;

    constructor(
        private userService: UserService,
        readonly dslCacheService: DslCacheService,
        private readonly dslRecorderService: DslRecorderService,
        private readonly gamificationService: GamificationService,
        private eventsService: EventsService,
    ) {
        this.gamificationService.coinBalance
            .pipe(distinctUntilChanged((previous, current) => previous.balance === current.balance))
            .subscribe((balance: CoinsBalance) => {
                this.balance = balance;
                dslCacheService.invalidate(['gamification']);
                this.eventsService.raise({ eventName: VanillaEventNames.TriggerAnimation });
            });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Gamification: this.dslRecorderService.createRecordable('gamification').createProperty({
                name: 'CoinsBalance',
                get: () => this.getCurrentValue<string>(() => (this.balance ? this.balance.balance : DSL_NOT_READY)),
                deps: () => ['gamification', 'user.isAuthenticated'],
            }),
        };
    }

    private getCurrentValue<T>(get: () => T, defaultValue = '') {
        if (!this.userService.isAuthenticated) {
            return defaultValue;
        }

        if (!this.gamificationService.isLoaded) {
            this.gamificationService.load();
        }

        return get();
    }
}
