import { Injectable } from '@angular/core';

import { EventContext, EventProcessor, EventType, RtmsType, TrackingService } from '@frontend/vanilla/core';

@Injectable()
export class CashierEventsProcessor implements EventProcessor {
    constructor(private trackingService: TrackingService) {}

    async process(event: EventContext<any>) {
        if (event.type !== EventType.Rtms) {
            return;
        }

        switch (event.name) {
            case RtmsType.CASHIER_DEPOSIT_RECOVERY:
                this.trackingService.triggerEvent(event.data.event, event.data);
                break;
        }
    }
}
