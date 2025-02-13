import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { EventsService, TrackingEventData, TrackingService, VanillaEventNames } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { firstValueFrom } from 'rxjs';

import { ConfirmPopupConfig } from './confirm-popup.client-config';
import { ConfirmPopupOptions } from './confirm-popup.models';

/**
 * @whatItDoes Display a confirmation popup.
 *
 * @howToUse
 *
 * ```
 * <vn-confirm-popup [options]="options" />
 * ```
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [IconCustomComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vn-confirm-popup',
    templateUrl: 'confirm-popup.html',
})
export class ConfirmPopupComponent implements OnInit {
    private readonly confirmPopupConfig = inject(ConfirmPopupConfig);
    private readonly eventsService = inject(EventsService);
    private readonly overlayRef = inject(OverlayRef);
    private readonly trackingService = inject(TrackingService);

    options = input<ConfirmPopupOptions>();
    messages = signal<{ [key: string]: string } | null>(null);
    content = computed(() => this.options()?.content ?? this.messages());

    async ngOnInit() {
        this.triggerEvent(this.options()?.trackingDataLoad);

        // if content passed we don't need to download config
        if (this.content()) return;
        await firstValueFrom(this.confirmPopupConfig.whenReady);

        this.messages.set(this.confirmPopupConfig.resources.messages);
    }

    leave() {
        this.triggerEvent(this.options()?.trackingDataClick, this.content()?.leaveButton);
        this.eventsService.raise({ eventName: VanillaEventNames.ConfirmPopupLeaveButton, data: { action: this.options()?.action } });
        this.close();
    }

    stay() {
        this.triggerEvent(this.options()?.trackingDataClick, this.content()?.stayButton);
        this.close();
    }

    private triggerEvent(trackData?: TrackingEventData, eventDetails?: string) {
        if (trackData) {
            if (eventDetails) {
                // add or replace component.EventDetails with clicked button text
                trackData.data = { ...trackData.data, 'component.EventDetails': eventDetails };
            }
            this.trackingService.triggerEvent(trackData.eventName, trackData.data);
        }
    }

    private close() {
        this.overlayRef.detach();
    }
}
