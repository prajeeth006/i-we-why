import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { DsButton } from '@frontend/ui/button';
import { CurrencyPipe } from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ConfettiComponent } from '@frontend/vanilla/shared/confetti';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { ReferredFriendsConfig } from '../referred-friends.client-config';
import { BonusNotificationMessage } from '../referred-friends.models';
import { ReferredFriendsService } from '../referred-friends.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vn-bonus-notification-overlay',
    templateUrl: 'bonus-notification-overlay.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/bonus-notification/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, ImageComponent, CurrencyPipe, TrustAsHtmlPipe, FormatPipe, ConfettiComponent, DsButton],
})
export class BonusNotificationOverlayComponent {
    private config = inject(ReferredFriendsConfig);
    private referredFriendsService = inject(ReferredFriendsService);

    readonly message = input<BonusNotificationMessage>({ bonusAmount: 0, depositAmount: 0, username: '' });
    readonly template = computed(() =>
        this.message().depositAmount ? this.config.content.refereebonusnotification : this.config.content.referrerbonusnotification,
    );

    close() {
        this.referredFriendsService.toggleReferralCompleted(false);
    }
}
