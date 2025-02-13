import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';

import { DepositLimitExceededConfig } from './deposit-limit-exceeded.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DynamicHtmlDirective, OverlayModule, HeaderBarComponent],
    selector: 'vn-deposit-limit-exceeded-overlay',
    templateUrl: 'deposit-limit-exceeded-overlay.html',
})
export class DepositLimitExceededOverlayComponent {
    constructor(
        private overlayRef: OverlayRef,
        public config: DepositLimitExceededConfig,
    ) {}

    close() {
        this.overlayRef.detach();
    }
}
