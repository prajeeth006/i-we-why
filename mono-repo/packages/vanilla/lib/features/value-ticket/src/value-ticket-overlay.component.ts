import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { CurrencyPipe, ViewTemplate } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subscription } from 'rxjs';

import { ValueTicketResourceService } from './value-ticket-resource.service';
import { ValueTicketTrackingService } from './value-ticket-tracking.service';
import { ValueTicketConfig } from './value-ticket.client-config';
import {
    PayoutValueTicketRequest,
    PayoutValueTicketResponse,
    TicketStatus,
    VALUE_TICKET_DATA,
    ValueTicketDialogContent,
    ValueTicketDialogType,
    ValueTicketErrorResponse,
    ValueTicketStatus,
} from './value-ticket.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, OverlayModule, TrustAsHtmlPipe, FormatPipe, CurrencyPipe],
    selector: 'vn-value-ticket-overlay',
    templateUrl: 'value-ticket-overlay.html',
})
export class ValueTicketOverlayComponent implements OnInit {
    ticketData = inject(VALUE_TICKET_DATA);
    private overlayRef = inject(OverlayRef);
    private valueTicketResourceService = inject(ValueTicketResourceService);
    private valueTicketConfig = inject(ValueTicketConfig);
    private valueTicketTrackingService = inject(ValueTicketTrackingService);
    private balancePropertiesService = inject(BalancePropertiesService);

    DialogType = ValueTicketDialogType;
    TicketStatus = ValueTicketStatus;
    dialog = signal<ValueTicketDialogContent | null>(null);
    isPayoutInProgress = signal<boolean>(false);

    private payoutValueTicketSubscription: Subscription;

    ngOnInit() {
        this.updateDialogContent();

        if (this.dialog()?.status === ValueTicketStatus.BLOCKED) {
            this.valueTicketTrackingService.trackBlockTicketOverlayDisplay(this.dialog()?.text);
        } else if (this.dialog()?.status === ValueTicketStatus.SCANNED) {
            this.valueTicketTrackingService.trackScanTicketOverlayDisplay();
        }
    }

    accept() {
        this.isPayoutInProgress.set(true);

        if (this.dialog()?.status === ValueTicketStatus.SCANNED) {
            this.valueTicketTrackingService.trackScanTicketOverlayClickEvent('yes continue');
        }

        const request: PayoutValueTicketRequest = {
            ...this.ticketData,
            id: this.ticketData.valueTicketId,
            description: this.ticketData.comments,
        };

        this.payoutValueTicketSubscription = this.valueTicketResourceService.payoutValueTicket(request).subscribe({
            next: (response: PayoutValueTicketResponse) => {
                this.ticketData = {
                    ...this.ticketData,
                    ...response,
                };

                this.balancePropertiesService.refresh();
                this.updateDialogContent();
                this.isPayoutInProgress.set(false);
            },
            error: (error: ValueTicketErrorResponse) => {
                this.ticketData = {
                    ...this.ticketData,
                    status: TicketStatus.FAILED,
                    valueTicketStatus: error?.errorCode || ValueTicketStatus.GENERAL_ERROR,
                };

                this.updateDialogContent();
                this.isPayoutInProgress.set(false);
            },
        });
    }

    close() {
        this.payoutValueTicketSubscription?.unsubscribe();

        if (this.dialog()?.status === ValueTicketStatus.BLOCKED) {
            this.valueTicketTrackingService.trackBlockTicketOverlayClickEvent(this.dialog()?.text);
        } else if (this.dialog()?.status === ValueTicketStatus.SCANNED) {
            this.valueTicketTrackingService.trackScanTicketOverlayClickEvent('no thanks');
        }

        this.overlayRef.detach();
    }

    private updateDialogContent() {
        let template: ViewTemplate | undefined;

        if (this.ticketData.status === TicketStatus.SUCCESS) {
            // OK 200
            if (this.ticketData.amlCurrentStatus === TicketStatus.BLOCKED || this.ticketData.amlCurrentStatus === TicketStatus.REJECTED) {
                template = this.getTemplate(ValueTicketStatus.BLOCKED);
            } else {
                if (this.ticketData.valueTicketStatus === ValueTicketStatus.PRINTED) {
                    template = this.getTemplate(ValueTicketStatus.SCANNED);
                } else if (this.ticketData.valueTicketStatus === ValueTicketStatus.PAID_OUT && !this.ticketData.transactionDate) {
                    template = this.getTemplate(ValueTicketStatus.PAID_OUT_SCAN);
                }
            }
        } else if (this.ticketData.status === ValueTicketStatus.PAID_OUT) {
            template = this.ticketData.transactionDate
                ? this.getTemplate(ValueTicketStatus.DEPOSIT_FAILED)
                : this.getTemplate(ValueTicketStatus.VALUE_TICKET_ALREADY_PAID);
        }

        if (!template) {
            /**
             * No match? Try with the status from the response or general error
             * See {@link ValueTicketStatus}
             */
            template = this.getTemplate(this.ticketData.valueTicketStatus) || this.getTemplate(ValueTicketStatus.GENERAL_ERROR);
        }

        this.dialog.set({
            title: template?.title,
            text: template?.text,
            ...template?.messages,
        });
    }

    private getTemplate(status: string): ViewTemplate | undefined {
        return this.valueTicketConfig.overlays.find((overlay: ViewTemplate) => overlay.messages?.status?.toUpperCase() === status.toUpperCase());
    }
}
