import { Injectable } from '@angular/core';

import { CashierService, EventContext, EventProcessor, EventType, LastKnownProductService, RtmsType, UserService } from '@frontend/vanilla/core';
import { KycStatusService } from '@frontend/vanilla/shared/kyc';
import { firstValueFrom } from 'rxjs';

import { RtmsEventsConfig } from './rtms-events-processor.client-config';

@Injectable()
export class KycEventsProcessor implements EventProcessor {
    constructor(
        private kycStatusService: KycStatusService,
        private user: UserService,
        private cashierService: CashierService,
        private lastKnownProduct: LastKnownProductService,
        private config: RtmsEventsConfig,
    ) {}

    async process(event: EventContext<any>) {
        if (event.type !== EventType.Rtms) {
            return;
        }

        switch (event.name) {
            case RtmsType.KYC_VERIFIED_EVENT:
                this.kycStatusService.refresh();
                await firstValueFrom(this.config.whenReady);

                if (!this.user.realPlayer && this.config.isCashierRedirectEnabled) {
                    await firstValueFrom(this.cashierService.whenReady);

                    return this.cashierService.goToCashierDeposit({
                        queryParameters: { ['showKYCVerifiedMessage']: 'true' },
                        returnUrl: this.lastKnownProduct.get().url,
                    });
                }
                break;
            case RtmsType.KYC_REFRESH_TRIGGER_EVENT:
                this.kycStatusService.refresh();
                break;
        }
    }
}
