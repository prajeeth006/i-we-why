import { Injectable } from '@angular/core';

import { NativeAppService, NativeEventType, OnFeatureInit } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { BalanceTransferService } from './balance-transfer.service';

@Injectable()
export class BalanceTransferBootstrapService implements OnFeatureInit {
    constructor(
        private service: BalanceTransferService,
        private nativeAppService: NativeAppService,
    ) {}

    onFeatureInit() {
        this.nativeAppService.eventsFromNative.pipe(filter((e) => e.eventName === NativeEventType.BALANCE_TRANSFER)).subscribe(() => {
            this.service.show();
        });
    }
}
