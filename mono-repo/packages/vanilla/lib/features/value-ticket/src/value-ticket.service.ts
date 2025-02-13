import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { EventType, NativeAppService, NativeEventType } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { ValueTicketOverlayComponent } from './value-ticket-overlay.component';
import { ValueTicketResourceService } from './value-ticket-resource.service';
import {
    TicketStatus,
    VALUE_TICKET_DATA,
    ValueTicketError,
    ValueTicketErrorResponse,
    ValueTicketRequest,
    ValueTicketResponse,
    ValueTicketStatus,
} from './value-ticket.models';

@Injectable()
export class ValueTicketService {
    private valueTicketResourceService = inject(ValueTicketResourceService);
    private nativeAppService = inject(NativeAppService);
    private injector = inject(Injector);
    private overlay = inject(OverlayFactory);

    private currentRef: OverlayRef | null;

    init(request: ValueTicketRequest) {
        this.valueTicketResourceService.getValueTicket(request).subscribe({
            next: (data: ValueTicketResponse) => {
                this.nativeAppService.sendToNative({
                    eventName: NativeEventType.EVENT_CAPTURE,
                    parameters: {
                        usecaseName: NativeEventType.SCAN_VT_COMPLETE,
                        reqRefId: request.reqRefId,
                        timestamp: new Date().toISOString(),
                        source: EventType.Vanilla,
                    },
                });

                this.showOverlay(data, request.source);
            },
            error: (error: ValueTicketErrorResponse) => {
                this.nativeAppService.sendToNative({
                    eventName: NativeEventType.EVENT_CAPTURE,
                    parameters: {
                        usecaseName: NativeEventType.SCAN_VT_ERROR,
                        reqRefId: request.reqRefId,
                        timestamp: new Date().toISOString(),
                        source: EventType.Vanilla,
                    },
                });
                this.showOverlay(
                    {
                        status: TicketStatus.FAILED,
                        valueTicketStatus: error?.errorCode || ValueTicketStatus.PRINTED,
                    },
                    request.source,
                );
            },
        });
    }

    private showOverlay(data: ValueTicketResponse | ValueTicketError, source: string) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-value-ticket-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(this.currentRef);
            this.currentRef = null;
        });

        const injector = Injector.create({
            providers: [
                { provide: OverlayRef, useValue: overlayRef },
                {
                    provide: VALUE_TICKET_DATA,
                    useValue: { ...data, source },
                },
            ],
            parent: this.injector,
        });

        const portal = new ComponentPortal(ValueTicketOverlayComponent, null, injector);

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
