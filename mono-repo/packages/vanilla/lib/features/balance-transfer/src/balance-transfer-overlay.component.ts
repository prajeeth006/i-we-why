import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthService, CommonMessages, NativeAppService, NativeEventType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'vn-balance-transfer-overlay',
    templateUrl: 'balance-transfer-overlay.html',
})
export class BalanceTransferOverlayComponent {
    constructor(
        public commonMessages: CommonMessages,
        private nativeAppService: NativeAppService,
        private overlayRef: OverlayRef,
        private authService: AuthService,
    ) {}

    transfer() {
        this.nativeAppService.sendToNative({ eventName: NativeEventType.BALANCE_TRANSFER });
        this.overlayRef.detach();
    }

    logout() {
        this.authService.logout({ redirectAfterLogout: false }).then(() => {
            this.overlayRef.detach();
        });
    }
}
