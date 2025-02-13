import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, input } from '@angular/core';

import { ViewTemplate } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { firstValueFrom } from 'rxjs';

import { BarcodeScannerConfig } from './barcode-scanner.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'vn-barcode-scanner-error-overlay',
    templateUrl: 'barcode-scanner-error-overlay.component.html',
})
export class BarcodeScannerErrorOverlayComponent implements OnInit {
    protected type = input.required<string>();
    readonly overlay = computed<ViewTemplate | undefined>(() =>
        this.barcodeScannerConfig.overlays.find((overlay: ViewTemplate) => overlay.messages?.type?.toUpperCase() === this.type().toUpperCase()),
    );

    constructor(
        private barcodeScannerConfig: BarcodeScannerConfig,
        private overlayRef: OverlayRef,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.barcodeScannerConfig.whenReady);
    }

    close() {
        this.overlayRef.detach();
    }
}
