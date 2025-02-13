import { Injectable } from '@angular/core';

import { NativeAppService, NativeEventType, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DepositLimitExceededConfig } from './deposit-limit-exceeded.client-config';
import { DepositLimitExceededService } from './deposit-limit-exceeded.service';

@Injectable()
export class DepositLimitExceededBootstrapService implements OnFeatureInit {
    constructor(
        private nativeAppService: NativeAppService,
        private config: DepositLimitExceededConfig,
        private betstationDepositLimitService: DepositLimitExceededService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.nativeAppService.eventsFromNative.pipe(filter((e) => e.eventName === NativeEventType.DEPOSIT_LIMIT_EXCEEDED)).subscribe(() => {
            this.betstationDepositLimitService.showOverlay();
        });
    }
}
