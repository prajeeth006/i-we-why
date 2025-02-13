import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';

import { CurrencyPipe } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { JackpotWinnerConfig } from './jackpot-winner.client-config';
import { JackpotWinnerEvent, PLAYER_GAME_JACKPOT_WIN } from './jackpot-winner.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ImageComponent, CurrencyPipe, IconCustomComponent],
    selector: 'vn-jackpot-winner-popup',
    templateUrl: 'jackpot-winner-popup.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/jackpot-winner/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class JackpotWinnerPopupComponent {
    readonly Number = Number;

    constructor(
        public config: JackpotWinnerConfig,
        public overlayRef: OverlayRef,
        @Inject(PLAYER_GAME_JACKPOT_WIN) public item: JackpotWinnerEvent,
    ) {}
}
