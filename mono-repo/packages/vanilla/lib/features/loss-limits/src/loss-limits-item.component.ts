import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CurrencyPipe } from '@frontend/vanilla/core';

import { LossLimitsConfig } from './loss-limits.client-config';
import { LossLimitsDetails } from './loss-limits.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, CurrencyPipe],
    selector: 'vn-loss-limits-item',
    templateUrl: 'loss-limits-item.html',
})
export class LossLimitsItemComponent {
    readonly config = inject(LossLimitsConfig);

    readonly item = input.required<LossLimitsDetails>();

    readonly usedPercentage = computed<number>(() => Math.round((this.item().usedPercentage + Number.EPSILON) * 100) / 100);
}
