import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { DsButton } from '@frontend/ui/button';
import { ClockService, CurrencyPipe, NativeAppService, NativeEventType, TimeFormat, UnitFormat } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { TerminalSessionConfig } from './terminal-session.client-config';
import { TerminalSessionNotification } from './terminal-session.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, OverlayModule, HeaderBarComponent, CurrencyPipe, TrustAsHtmlPipe, FormatPipe, DsButton],
    selector: 'vn-terminal-session-overlay',
    templateUrl: 'terminal-session-overlay.html',
})
export class TerminalSessionOverlayComponent {
    readonly terminalSessionNotification = input.required<TerminalSessionNotification>();

    readonly terminalSessionConfig = inject(TerminalSessionConfig);
    private readonly clockService = inject(ClockService);
    private readonly nativeAppService = inject(NativeAppService);
    private readonly overlayRef = inject(OverlayRef);

    readonly timeActive = computed<string>(() =>
        this.clockService.toTotalTimeStringFormat(this.terminalSessionNotification().timeActive, {
            timeFormat: <TimeFormat>this.terminalSessionConfig.content.validation?.timeFormat || TimeFormat.HMS,
            hideZeros: !!this.terminalSessionConfig.content.validation?.hideZeros,
            unitFormat: UnitFormat.Hidden,
        }),
    );

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
