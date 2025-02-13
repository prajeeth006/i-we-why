import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { ClockService, TimeFormat, TimeSpan, TotalTimePipe, UnitFormat } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { SessionLimitsConfig } from './session-limits.client-config';
import { SessionLimit } from './session-limits.models';

@Component({
    standalone: true,
    imports: [CommonModule, TotalTimePipe, TrustAsHtmlPipe],
    selector: 'vn-session-limits-item',
    templateUrl: 'session-limits-item.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/session-limits/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionLimitsItemComponent {
    readonly limits = input.required<SessionLimit[]>();

    readonly TimeSpan = TimeSpan;
    readonly UnitFormat = UnitFormat;
    readonly formattedTime = computed(() => {
        const defaultFormat = { unitFormat: UnitFormat.Long, timeFormat: TimeFormat.HM, hideZeros: false };
        const currentLimit = TimeSpan.fromMinutes(this.limits()[0]?.sessionLimitConfiguredMins || 0);

        return this.clockService.toTotalTimeStringFormat(currentLimit, { ...defaultFormat, ...this.config.content.validation });
    });
    readonly formattedTimeTemplate = computed(() =>
        this.formattedTime()
            .split(/\s+/)
            .map((part: string) =>
                part.match(/\d+/) ? `<span class="h4-v2 daily-limit">${part}</span>` : `<span class="txt-md-v2 daily-limit-timecount">${part}</span>`,
            )
            .join(' '),
    );

    config = inject(SessionLimitsConfig);
    private clockService = inject(ClockService);
}
