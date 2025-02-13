import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { PlayerAttributes } from './player-attributes.models';
import { PlayerAttributesService } from './player-attributes.service';

@Injectable()
export class PlayerAttributesDslValuesProvider implements DslValuesProvider {
    private playerAttributes: PlayerAttributes | null;
    private loaded = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private playerAttributesService: PlayerAttributesService,
        private userService: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.playerAttributesService.playerAttributes.subscribe((playerAttributes: PlayerAttributes | null) => {
            this.playerAttributes = playerAttributes;
            dslCacheService.invalidate(['playerAttributes']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            PlayerAttributes: this.dslRecorderService
                .createRecordable('playerAttributes')
                .createFunction({
                    name: 'GetAcknowledged',
                    get: (key: string) => this.getCurrentValue('acknowledgement', key),
                    deps: ['playerAttributes', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'GetVip',
                    get: (key: string) => this.getCurrentValue('vip', key),
                    deps: ['playerAttributes', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(type: 'vip' | 'acknowledgement', key: string): string {
        if (!this.userService.isAuthenticated) {
            return '';
        }

        if (!this.loaded) {
            this.loaded = true;
            this.playerAttributesService.refresh();
        }

        return this.playerAttributes ? (this.playerAttributes[type]?.[key]?.value ?? '') : DSL_NOT_READY;
    }
}
