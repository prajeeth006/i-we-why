import { Injectable } from '@angular/core';

import { EventProcessor } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';

@Injectable()
export class BalanceRefreshProcessor implements EventProcessor {
    constructor(private balancePropertiesService: BalancePropertiesService) {}

    process() {
        this.balancePropertiesService.refresh();
    }
}
