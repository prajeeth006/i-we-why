import { Injectable, inject } from '@angular/core';

import { CookieName, CookieService, EventsService, OnFeatureInit, RemoteLogger, SimpleEvent, VanillaEventNames } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ValueTicketConfig } from './value-ticket.client-config';
import { ValueTicketRequest } from './value-ticket.models';
import { ValueTicketService } from './value-ticket.service';

@Injectable()
export class ValueTicketBootstrapService implements OnFeatureInit {
    private valueTicketConfig = inject(ValueTicketConfig);
    private eventsService = inject(EventsService);
    private valueTicketService = inject(ValueTicketService);
    private cookieService = inject(CookieService);
    private remoteLogger = inject(RemoteLogger);

    async onFeatureInit() {
        await firstValueFrom(this.valueTicketConfig.whenReady);

        if (!this.valueTicketConfig.isEnabled) {
            return;
        }

        this.eventsService.events
            .pipe(filter((e: SimpleEvent | null) => e?.eventName.toUpperCase() === VanillaEventNames.ValueTicket))
            .subscribe((event: SimpleEvent | null) => {
                const shopId = this.cookieService.get(CookieName.ShopId);
                const terminalId = this.cookieService.get(CookieName.TerminalId);

                if (shopId && terminalId) {
                    const request: ValueTicketRequest = {
                        id: event?.data.barcode,
                        source: event?.data.source,
                        reqRefId: event?.data.reqRefId,
                        shopId,
                        terminalId,
                    };

                    this.valueTicketService.init(request);
                } else {
                    this.remoteLogger.logError(`shop_id and/or terminal_id cookies are missing for ValueTicket: ${event?.data.barcode}`);
                }
            });
    }
}
