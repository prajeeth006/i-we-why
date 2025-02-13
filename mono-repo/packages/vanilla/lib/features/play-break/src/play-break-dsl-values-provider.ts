import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider } from '@frontend/vanilla/core';

import { PlayBreak } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Injectable()
export class PlayBreakDslValuesProvider implements DslValuesProvider {
    private playBreak: PlayBreak | null;
    private loaded: boolean;

    constructor(
        private dslRecorderService: DslRecorderService,
        private playBreakService: PlayBreakService,
        dslCacheService: DslCacheService,
    ) {
        this.playBreakService.playBreak.subscribe((playBreak: PlayBreak | null) => {
            this.loaded = true;
            this.playBreak = playBreak;
            dslCacheService.invalidate(['playBreak']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            PlayBreak: this.dslRecorderService
                .createRecordable('playBreak')
                .createProperty({
                    name: 'IsActive',
                    get: () => this.getCurrentValue(() => (this.playBreak ? this.playBreak.playBreak : DSL_NOT_READY)),
                    deps: ['playBreak', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'BreakType',
                    get: () => this.getCurrentValue(() => (this.playBreak ? this.playBreak.playBreakType : DSL_NOT_READY)),
                    deps: ['playBreak', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'EndDate',
                    get: () => this.getCurrentValue(() => (this.playBreak ? this.playBreak.playBreakEndTime : DSL_NOT_READY)),
                    deps: ['playBreak', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue<T>(get: () => T): T {
        if (!this.loaded) {
            this.loaded = true;
            this.playBreakService.load();
        }

        return get();
    }
}
