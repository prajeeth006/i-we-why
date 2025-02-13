import { Injectable } from '@angular/core';

import { DynamicLayoutService, LocalStoreKey, LocalStoreService, SharedFeaturesApiService, SlotName } from '@frontend/vanilla/core';

import { PlayerActiveWagerTimerComponent } from './player-active-wager-timer.component';
import { ActiveWagerDetails } from './player-active-wager.models';

@Injectable({ providedIn: 'root' })
export class PlayerActiveWagerService {
    constructor(
        private api: SharedFeaturesApiService,
        private dynamicLayoutService: DynamicLayoutService,
        private localStoreService: LocalStoreService,
    ) {}

    refreshWagerTimer() {
        this.api.get('activeWagerDetails').subscribe((details: ActiveWagerDetails) => {
            const isActive = !details.blockWager && details.firstActivatedTime !== '1970-01-01T00:00:00Z';

            this.setWagerTimer(isActive, details.firstActivatedTime);
        });
    }

    setWagerTimer(active: boolean, wagerTimestamp: string = '') {
        if (active) {
            this.localStoreService.set(LocalStoreKey.LugasTimestamp, wagerTimestamp);
            this.dynamicLayoutService.removeComponent(SlotName.HeaderTopItems, PlayerActiveWagerTimerComponent);
            this.dynamicLayoutService.addComponent(SlotName.HeaderTopItems, PlayerActiveWagerTimerComponent, {});
        } else {
            this.localStoreService.remove(LocalStoreKey.LugasTimestamp);
            this.dynamicLayoutService.removeComponent(SlotName.HeaderTopItems, PlayerActiveWagerTimerComponent);
        }
    }
}
