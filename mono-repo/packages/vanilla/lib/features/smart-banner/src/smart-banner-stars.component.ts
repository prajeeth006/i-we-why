import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { trackByItem } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

@Component({
    standalone: true,
    imports: [CommonModule, IconCustomComponent],
    selector: 'vn-smart-banner-stars',
    templateUrl: 'smart-banner-stars.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartBannerStarsComponent {
    readonly rating = input.required<number>();

    starClass = computed(() =>
        [1, 2, 3, 4, 5].map((c: number) => {
            const difference = c - this.rating();
            return difference >= 1 ? 'theme-rating-star-empty' : difference >= 0.5 ? 'theme-rating-star-half' : 'theme-rating-star-full';
        }),
    );
    readonly trackByItem = trackByItem;
}
