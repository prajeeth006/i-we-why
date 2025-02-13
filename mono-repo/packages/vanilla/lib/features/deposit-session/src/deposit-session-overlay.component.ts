import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { DsButton } from '@frontend/ui/button';
import { CurrencyPipe, NativeAppService, NativeEventType } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DepositSessionConfig } from './deposit-session.client-config';
import { DepositSessionEvent } from './deposit-session.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, OverlayModule, HeaderBarComponent, CurrencyPipe, TrustAsHtmlPipe, FormatPipe, DsButton],
    selector: 'vn-deposit-session-overlay',
    templateUrl: 'deposit-session-overlay.html',
})
export class DepositSessionOverlayComponent {
    readonly depositSessionEvent = input.required<DepositSessionEvent>();

    readonly depositSessionConfig = inject(DepositSessionConfig);
    private readonly nativeAppService = inject(NativeAppService);
    private readonly overlayRef = inject(OverlayRef);

    continueSession() {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SESSION_CONTINUE,
        });

        this.overlayRef.detach();
    }

    finishSession() {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SESSION_EXIT,
        });

        this.overlayRef.detach();
    }
}
