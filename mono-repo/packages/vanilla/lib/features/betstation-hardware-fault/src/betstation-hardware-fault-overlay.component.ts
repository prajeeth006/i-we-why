import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';

import { CommonMessages, ViewTemplate } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { firstValueFrom } from 'rxjs';

import { BetstationHardwareFaultConfig } from './betstation-hardware-fault.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, OverlayModule],
    selector: 'vn-betstation-hardware-fault',
    templateUrl: 'betstation-hardware-fault-overlay.html',
})
export class BetstationHardwareFaultOverlayComponent implements OnInit {
    readonly type = input.required<string>();
    readonly messages = signal(this.commonMessages);
    readonly overlay = computed<ViewTemplate | undefined>(() =>
        this.config.overlays.find((overlay: ViewTemplate) => overlay.messages?.type?.toUpperCase() === this.type().toUpperCase()),
    );

    constructor(
        private commonMessages: CommonMessages,
        private config: BetstationHardwareFaultConfig,
        private overlayRef: OverlayRef,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.config.whenReady);
    }

    close() {
        this.overlayRef.detach();
    }
}
